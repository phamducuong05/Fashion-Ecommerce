# Read the SQL file
$content = Get-Content "c:\Users\Admin\Downloads\seed_data.sql" -Raw

# Fix table names (snake_case to PascalCase) with quotes
$content = $content -replace 'categories\b', '"Category"'
$content = $content -replace 'products\b', '"Product"'  
$content = $content -replace 'product_variants\b', '"ProductVariant"'

# Fix column names (snake_case to camelCase) with quotes
$content = $content -replace '\bparent_id\b', '"parentId"'
$content = $content -replace '\bproduct_id\b', '"productId"'
$content = $content -replace '\boriginal_price\b', '"originalPrice"'
$content = $content -replace '\breview_count\b', '"reviewCount"'
$content = $content -replace '\bis_active\b', '"isActive"'

# Fix sequence names with quotes
$content = $content -replace 'products_id_seq', '"Product_id_seq"'
$content = $content -replace 'product_id_seq', '"Product_id_seq"'
$content = $content -replace 'categories_id_seq', '"Category_id_seq"'
$content = $content -replace '\busers\b', '"User"'

# Save to new file
$content | Set-Content "seed_data_final.sql"

Write-Host "✅ Created seed_data_final.sql with fixed table and column names"
