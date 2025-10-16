# Test Angular Website API Integration
Write-Host "Testing Angular Website API Integration..." -ForegroundColor Green

# Test if Angular is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4200" -UseBasicParsing
    Write-Host "✅ Angular website is running on http://localhost:4200" -ForegroundColor Green
} catch {
    Write-Host "❌ Angular website is not running" -ForegroundColor Red
    exit 1
}

# Test API endpoints that the website uses
Write-Host "`nTesting API endpoints..." -ForegroundColor Yellow

# Test Services endpoint
try {
    $services = Invoke-RestMethod -Uri "http://localhost:5161/api/services" -Method Get
    Write-Host "✅ Services API: $($services.Count) services available" -ForegroundColor Green
} catch {
    Write-Host "❌ Services API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Categories endpoint
try {
    $categories = Invoke-RestMethod -Uri "http://localhost:5161/api/categories" -Method Get
    Write-Host "✅ Categories API: $($categories.Count) categories available" -ForegroundColor Green
} catch {
    Write-Host "❌ Categories API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Assemblers endpoint
try {
    $assemblers = Invoke-RestMethod -Uri "http://localhost:5161/api/assemblers" -Method Get
    Write-Host "✅ Assemblers API: $($assemblers.Count) assemblers available" -ForegroundColor Green
} catch {
    Write-Host "❌ Assemblers API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Authentication
try {
    $loginBody = @{ email = "test@test.com"; password = "password123" } | ConvertTo-Json
    $auth = Invoke-RestMethod -Uri "http://localhost:5161/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "✅ Authentication API: Login successful for $($auth.User.Name)" -ForegroundColor Green
} catch {
    Write-Host "❌ Authentication API failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 API Integration Test Complete!" -ForegroundColor Green
Write-Host "Website: http://localhost:4200" -ForegroundColor Cyan
Write-Host "API Swagger: http://localhost:5161/swagger" -ForegroundColor Cyan
