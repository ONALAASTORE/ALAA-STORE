-- ==============================================================================
-- ON ALAA STORE - E-COMMERCE PRODUCT DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- ==============================================================================
-- This schema supports multi-image galleries per product via:
-- 1. `image_urls` (TEXT[]): Array of all image URLs (primary is index 1/0)
-- 2. `image` (TEXT): Primary cover image URL for backwards compatibility
-- 3. `additional_images` (TEXT[] or JSONB): Array of supplementary gallery images
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLE DEFINITION
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT DEFAULT 'Electronics',
    description TEXT,
    features TEXT[] DEFAULT '{}',
    specs JSONB DEFAULT '{}'::JSONB,
    
    -- Single primary cover image (backwards compatibility)
    image TEXT NOT NULL,
    
    -- Multiple image support: Array of all image URLs (Primary featured at index 1)
    image_urls TEXT[] NOT NULL DEFAULT '{}',
    
    -- Additional gallery images (secondary angles, lifestyle shots, unpackaging)
    additional_images TEXT[] DEFAULT '{}',
    
    base_price_usd NUMERIC(10, 2) NOT NULL CHECK (base_price_usd >= 0),
    original_price_usd NUMERIC(10, 2),
    variants JSONB DEFAULT '[]'::JSONB,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    condition TEXT DEFAULT 'Brand New (Sealed)',
    warranty TEXT DEFAULT '1 Year Official Agency Warranty',
    in_stock BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_hot_deal BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    free_delivery BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MIGRATION QUERY FOR EXISTING TABLES:
-- If your database already has an existing `products` table with only a single `image` column,
-- run the following migration commands to safely add `image_urls` and `additional_images`:

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS additional_images TEXT[] DEFAULT '{}';

-- Backfill existing single images into the multi-image array
UPDATE public.products
SET image_urls = ARRAY[image]
WHERE (image_urls IS NULL OR cardinality(image_urls) = 0)
  AND image IS NOT NULL 
  AND image != '';

-- Automatically sync `image` with the first element of `image_urls` if `image` is null
UPDATE public.products
SET image = image_urls[1]
WHERE (image IS NULL OR image = '') 
  AND cardinality(image_urls) > 0;

-- 3. AUTO-SYNC TRIGGER (OPTIONAL BUT RECOMMENDED)
-- Keeps `image` and `image_urls[1]` in sync automatically on INSERT or UPDATE
CREATE OR REPLACE FUNCTION public.sync_product_images()
RETURNS TRIGGER AS $$
BEGIN
    -- If image_urls is provided but image is not, set image to first URL
    IF (NEW.image IS NULL OR NEW.image = '') AND cardinality(NEW.image_urls) > 0 THEN
        NEW.image := NEW.image_urls[1];
    END IF;

    -- If image is provided and image_urls is empty, initialize image_urls with image
    IF (NEW.image IS NOT NULL AND NEW.image != '') AND (NEW.image_urls IS NULL OR cardinality(NEW.image_urls) = 0) THEN
        NEW.image_urls := ARRAY[NEW.image];
    END IF;

    -- If image is changed and doesn't match the first element, ensure it is first
    IF NEW.image IS NOT NULL AND NEW.image != '' THEN
        IF cardinality(NEW.image_urls) = 0 OR NEW.image_urls[1] != NEW.image THEN
            NEW.image_urls := ARRAY[NEW.image] || array_remove(NEW.image_urls, NEW.image);
        END IF;
    END IF;

    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_product_images ON public.products;
CREATE TRIGGER trg_sync_product_images
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.sync_product_images();

-- 4. ROW LEVEL SECURITY (RLS) FOR SUPABASE
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active products
CREATE POLICY "Allow public read access to products"
ON public.products FOR SELECT
USING (true);

-- Allow authenticated admin users to insert/update/delete products
CREATE POLICY "Allow admin write access to products"
ON public.products FOR ALL
USING (auth.role() = 'authenticated');

-- 5. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);

-- GIN index for search inside image arrays if needed
CREATE INDEX IF NOT EXISTS idx_products_image_urls ON public.products USING GIN (image_urls);
