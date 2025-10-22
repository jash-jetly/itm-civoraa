# Supabase Storage Policies Configuration

## Required Storage Buckets
1. `discussions` - For discussion post images
2. `news` - For news article images

## Required RLS Policies

### For `discussions` bucket:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'discussions' AND 
  auth.role() = 'authenticated'
);

-- Allow public read access to images
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'discussions');

-- Allow users to delete their own uploads (optional)
CREATE POLICY "Allow users to delete own uploads" ON storage.objects
FOR DELETE USING (
  bucket_id = 'discussions' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### For `news` bucket:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'news' AND 
  auth.role() = 'authenticated'
);

-- Allow public read access to images
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'news');

-- Allow users to delete their own uploads (optional)
CREATE POLICY "Allow users to delete own uploads" ON storage.objects
FOR DELETE USING (
  bucket_id = 'news' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## How to Apply These Policies

1. Go to your Supabase Dashboard
2. Navigate to Storage > Policies
3. Create new policies for each bucket using the SQL above
4. Make sure both buckets are set to "Public" in Storage settings

## Alternative: Disable RLS (Less Secure)

If you want to quickly test without setting up policies:

```sql
-- Disable RLS for storage.objects (NOT RECOMMENDED for production)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

**Note**: Only use the alternative for testing. Always use proper RLS policies in production.