# Azure CLI Commands for Free Setup

# 1. Login to Azure
az login

# 2. Create Resource Group
az group create --name assemblers-free-rg --location eastus

# 3. Create SQL Server
az sql server create \
  --name assemblers-free-server \
  --resource-group assemblers-free-rg \
  --location eastus \
  --admin-user assemblersadmin \
  --admin-password "YourStrong@Passw0rd123!"

# 4. Create SQL Database
az sql db create \
  --resource-group assemblers-free-rg \
  --server assemblers-free-server \
  --name AssemblersDb \
  --service-objective Basic

# 5. Get Connection String
az sql db show-connection-string \
  --server assemblers-free-server \
  --name AssemblersDb \
  --client ado.net
