# Azure Deployment Guide

## 🚀 **Complete Azure Setup Guide**

### **Step 1: Get Azure Subscription**
1. **Go to**: https://azure.microsoft.com/en-us/free/
2. **Sign up** for free account ($200 credit)
3. **Verify your account**

### **Step 2: Create Azure Resources**

#### **Resource Group**
- **Name**: `assemblers-rg`
- **Region**: `East US`

#### **SQL Server**
- **Server name**: `assemblers-sql-server` (must be unique globally)
- **Admin login**: `assemblersadmin`
- **Password**: `YourStrong@Passw0rd123!`
- **Resource group**: `assemblers-rg`

#### **SQL Database**
- **Database name**: `AssemblersDb`
- **Server**: `assemblers-sql-server`
- **Pricing tier**: `Basic` (cheapest)

#### **App Service**
- **App name**: `assemblers-api` (must be unique globally)
- **Resource group**: `assemblers-rg`
- **Runtime**: `.NET 9`
- **OS**: `Linux`

### **Step 3: Configure Connection String**

In Azure Portal:
1. **Go to your App Service**
2. **Settings** → **Configuration**
3. **Add new connection string**:
   - **Name**: `DefaultConnection`
   - **Value**: `Server=tcp:assemblers-sql-server.database.windows.net,1433;Initial Catalog=AssemblersDb;Persist Security Info=False;User ID=assemblersadmin;Password=YourStrong@Passw0rd123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;`

### **Step 4: Deploy Your API**

#### **Method 1: Visual Studio Code**
1. **Install Azure Extension**
2. **Right-click** on AssemblersApi folder
3. **Deploy to Web App**

#### **Method 2: Azure CLI**
```bash
# Login to Azure
az login

# Deploy
az webapp deployment source config-zip \
  --resource-group assemblers-rg \
  --name assemblers-api \
  --src ./publish.zip
```

#### **Method 3: GitHub Actions**
1. **Push code to GitHub**
2. **Set up GitHub Actions**
3. **Auto-deploy on push**

### **Step 5: Run Database Migrations**

After deployment:
1. **Go to App Service** → **SSH**
2. **Run migrations**:
```bash
dotnet ef database update
```

### **Step 6: Test Your Deployed API**

Your API will be available at:
```
https://assemblers-api.azurewebsites.net/swagger
```

## 🔧 **Local Development with Azure**

### **Switch Between Local and Azure**

#### **Use Local Database (Development)**
```bash
cd AssemblersApi
dotnet run
# Uses localhost SQL Server
```

#### **Use Azure Database (Testing)**
```bash
cd AssemblersApi
dotnet run --environment Production
# Uses Azure SQL Database
```

## 💰 **Cost Estimation**

### **Free Tier Usage**
- **SQL Database Basic**: $5/month
- **App Service**: Free tier available
- **Total**: ~$5/month

### **Free Credits**
- **New account**: $200 credit (30 days)
- **Student account**: $100 credit (12 months)

## 🔒 **Security Best Practices**

### **Connection String Security**
- **Use Azure Key Vault** for production
- **Never commit** connection strings to Git
- **Use managed identities** when possible

### **Database Security**
- **Enable firewall rules**
- **Use SSL encryption**
- **Regular backups**

## 🚀 **Next Steps**

1. **Get Azure subscription**
2. **Create resources** (SQL Server, Database, App Service)
3. **Deploy your API**
4. **Run migrations**
5. **Test deployed API**
6. **Connect Angular frontend** to Azure API

## 📞 **Support**

- **Azure Documentation**: https://docs.microsoft.com/en-us/azure/
- **Azure Support**: Available in portal
- **Community Forums**: https://docs.microsoft.com/en-us/answers/

Your API is ready for Azure deployment! 🎉
