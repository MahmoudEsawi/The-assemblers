# Comprehensive QA Test Script for Assemblers API
Write-Host "Starting Comprehensive QA Testing..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

$totalTests = 0
$passedTests = 0

# Test 1: Basic API Health Check
$totalTests++
Write-Host "`nTesting: API Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5161/api/test/database" -Method Get
    Write-Host "PASSED: API Health Check" -ForegroundColor Green
    $passedTests++
} catch {
    Write-Host "FAILED: API Health Check - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get All Services
$totalTests++
Write-Host "`nTesting: Get All Services" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5161/api/services" -Method Get
    Write-Host "PASSED: Get All Services ($($response.Count) services)" -ForegroundColor Green
    $passedTests++
} catch {
    Write-Host "FAILED: Get All Services - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get Service by Valid ID
$totalTests++
Write-Host "`nTesting: Get Service by Valid ID" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5161/api/services/1" -Method Get
    Write-Host "PASSED: Get Service by Valid ID" -ForegroundColor Green
    $passedTests++
} catch {
    Write-Host "FAILED: Get Service by Valid ID - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get Service by Invalid ID (Should return 404)
$totalTests++
Write-Host "`nTesting: Get Service by Invalid ID" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5161/api/services/99999" -Method Get
    Write-Host "FAILED: Get Service by Invalid ID (Should return 404)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "PASSED: Get Service by Invalid ID (Correctly returned 404)" -ForegroundColor Green
        $passedTests++
    } else {
        Write-Host "FAILED: Get Service by Invalid ID - Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 5: Get All Categories
$totalTests++
Write-Host "`nTesting: Get All Categories" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5161/api/categories" -Method Get
    Write-Host "PASSED: Get All Categories ($($response.Count) categories)" -ForegroundColor Green
    $passedTests++
} catch {
    Write-Host "FAILED: Get All Categories - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Get All Assemblers
$totalTests++
Write-Host "`nTesting: Get All Assemblers" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5161/api/assemblers" -Method Get
    Write-Host "PASSED: Get All Assemblers ($($response.Count) assemblers)" -ForegroundColor Green
    $passedTests++
} catch {
    Write-Host "FAILED: Get All Assemblers - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Search Services
$totalTests++
Write-Host "`nTesting: Search Services" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5161/api/services/search?searchTerm=furniture" -Method Get
    Write-Host "PASSED: Search Services ($($response.Count) results)" -ForegroundColor Green
    $passedTests++
} catch {
    Write-Host "FAILED: Search Services - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: User Registration
$totalTests++
Write-Host "`nTesting: User Registration" -ForegroundColor Yellow
try {
    $registerBody = @{
        name = "QA Test User"
        email = "qa@test.com"
        password = "password123"
        role = "Customer"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:5161/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "PASSED: User Registration" -ForegroundColor Green
    $passedTests++
} catch {
    Write-Host "FAILED: User Registration - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 9: User Login
$totalTests++
Write-Host "`nTesting: User Login" -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "qa@test.com"
        password = "password123"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:5161/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "PASSED: User Login" -ForegroundColor Green
    $passedTests++
} catch {
    Write-Host "FAILED: User Login - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 10: Login with Invalid Credentials
$totalTests++
Write-Host "`nTesting: Login with Invalid Credentials" -ForegroundColor Yellow
try {
    $invalidLoginBody = @{
        email = "qa@test.com"
        password = "wrongpassword"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:5161/api/auth/login" -Method Post -Body $invalidLoginBody -ContentType "application/json"
    Write-Host "FAILED: Login with Invalid Credentials (Should return error)" -ForegroundColor Red
} catch {
    Write-Host "PASSED: Login with Invalid Credentials (Correctly rejected)" -ForegroundColor Green
    $passedTests++
}

# Test 11: Angular Website Accessibility
$totalTests++
Write-Host "`nTesting: Angular Website Accessibility" -ForegroundColor Yellow
try {
    $websiteResponse = Invoke-WebRequest -Uri "http://localhost:4200" -UseBasicParsing
    Write-Host "PASSED: Angular Website Accessibility" -ForegroundColor Green
    $passedTests++
} catch {
    Write-Host "FAILED: Angular Website Accessibility - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 12: Swagger UI Accessibility
$totalTests++
Write-Host "`nTesting: Swagger UI Accessibility" -ForegroundColor Yellow
try {
    $swaggerResponse = Invoke-WebRequest -Uri "http://localhost:5161/swagger" -UseBasicParsing
    Write-Host "PASSED: Swagger UI Accessibility" -ForegroundColor Green
    $passedTests++
} catch {
    Write-Host "FAILED: Swagger UI Accessibility - $($_.Exception.Message)" -ForegroundColor Red
}

# Summary
Write-Host "`nQA Test Results Summary" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $($totalTests - $passedTests)" -ForegroundColor Red
Write-Host "Success Rate: $([math]::Round(($passedTests / $totalTests) * 100, 2))%" -ForegroundColor Yellow

if ($passedTests -eq $totalTests) {
    Write-Host "`nALL TESTS PASSED! System is ready for production." -ForegroundColor Green
} else {
    Write-Host "`nSome tests failed. Please review the results above." -ForegroundColor Yellow
}

Write-Host "`nAccess Points:" -ForegroundColor Cyan
Write-Host "  Website: http://localhost:4200" -ForegroundColor White
Write-Host "  API Swagger: http://localhost:5161/swagger" -ForegroundColor White
Write-Host "  API Base: http://localhost:5161/api" -ForegroundColor White