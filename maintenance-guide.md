# Maintenance Guide - RepairShop System

## 6.1 Installation

### 6.1.1 Required Components

* Node.js and npm environment (for Next.js framework)
* Kinde account credentials (authentication service)
* Azure subscription (file storage solution)
* Neon PostgreSQL instance (database service)
* Git version control system

### 6.1.2 Initial Configuration

#### Obtaining source code:
```bash
git clone <repository-url>
cd repairshop
```

#### Installing dependencies:
```bash
npm install
```

#### Setting environment variables:
Create a `.env.local` file in the project's root directory with the following parameters:

```
# Kinde Auth Configuration
KINDE_CLIENT_ID=<your-kinde-client-id>
KINDE_CLIENT_SECRET=<your-kinde-client-secret>
KINDE_MACHINE_ID=<your-kinde-machine-id>
KINDE_MACHINE_SECERT=<your-kinde-machine-secret>
KINDE_ISSUER_URL=<your-kinde-issuer-url>
KINDE_SITE_URL=<your-site-url>
KINDE_POST_LOGOUT_REDIRECT_URL=<your-post-logout-redirect-url>
KINDE_POST_LOGIN_REDIRECT_URL=<your-post-login-redirect-url>

# Database Configuration
DATABASE_URL=<your-neon-postgresql-connection-string>

# Auth Secret
AUTH_SECRET=<your-auth-secret>

# Google Auth (Optional)
AUTH_GOOGLE_ID=<your-google-auth-id>
AUTH_GOOGLE_SECRET=<your-google-auth-secret>

# Azure Storage Configuration
AZURE_STORAGE_CONNECTION_STRING=<your-azure-storage-connection-string>
AZURE_STORAGE_ACCOUNT_NAME=<your-azure-storage-account-name>
AZURE_ACCOUNT_KEY=<your-azure-account-key>
AZURE_STORAGE_CONTAINER_NAME=<your-azure-storage-container-name>

# Site URL
NEXT_PUBLIC_SITE_URL=<your-site-url>
```

#### Database setup:
```bash
npm run db:migrate
```

#### Running the local environment:
```bash
npm run dev
```

The system will be accessible at: http://localhost:3000

## 6.2 Configuration

### 6.2.1 Authentication Settings

The system uses Kinde as an authentication solution. Configure the following parameters in the Kinde dashboard:

1. **Application Setup**:
   - Application type: Regular Web Application
   - Authorized redirect URLs: `http://localhost:3000/api/auth/kinde/callback` (development), `https://your-production-domain.com/api/auth/kinde/callback` (production)
   - Logout URLs: `http://localhost:3000` (development), `https://your-production-domain.com` (production)

2. **Permission Setup**:
   - Configure the required permissions for different user roles (admin, manager, user)

### 6.2.2 Azure Storage Settings

1. **Creating a Storage Account**:
   - Create a storage account in Azure
   - Create a container for system files
   - Configure public access policy for the container according to security requirements

2. **Setting Access Keys**:
   - Obtain the connection string and access keys from the Azure dashboard
   - Configure the keys in the environment file

### 6.2.3 Neon PostgreSQL Database Settings

1. **Creating an Instance**:
   - Create a PostgreSQL instance on the Neon platform
   - Create a database for the system

2. **Connection Setup**:
   - Obtain the connection string from the Neon dashboard
   - Configure the connection string in the environment file

## 6.3 Version Management

### 6.3.1 Updating Versions

The system is based on Next.js and additional dependencies. To update versions:

```bash
# Update all dependencies to the latest versions
npm update

# Update a specific dependency
npm update <package-name>

# Update Next.js to the latest version
npm install next@latest
```

### 6.3.2 Compatibility Testing

After updating versions, perform compatibility tests:

```bash
# Check for potential issues
npm run lint

# Build the application to check for errors
npm run build

# Run the application in development environment
npm run dev
```

## 6.4 Backup and Recovery

### 6.4.1 Database Backup

1. **Manual Backup**:
   - Use the Neon PostgreSQL backup tool from the dashboard
   - Export data using the pg_dump command:
   ```bash
   pg_dump -h <host> -U <username> -d <database> -F c -b -v -f backup.dump
   ```

2. **Automatic Backup**:
   - Configure automatic backups on the Neon platform
   - Set backup frequency according to business requirements (daily/weekly)

### 6.4.2 File Backup

1. **Azure Storage Backup**:
   - Use the Azure Storage backup tool
   - Configure backup policy for the container

2. **Data Recovery**:
   - Database recovery:
   ```bash
   pg_restore -h <host> -U <username> -d <database> -v backup.dump
   ```
   - File recovery: Use the Azure Storage recovery tool

## 6.5 Monitoring and Performance

### 6.5.1 Error Monitoring

The system uses Sentry for error monitoring:

1. **Sentry Setup**:
   - Create a project in Sentry
   - Configure the DSN key in the environment file:
   ```
   NEXT_PUBLIC_SENTRY_DSN=<your-sentry-dsn>
   ```

2. **Viewing Errors**:
   - Access the Sentry dashboard to view errors
   - Configure alerts for critical errors

### 6.5.2 Performance Monitoring

1. **Server Monitoring**:
   - Use monitoring tools like New Relic or Datadog
   - Monitor response times, resource usage, and availability

2. **Client-Side Monitoring**:
   - Use Google Analytics or similar tools
   - Monitor loading times, resource usage, and user experience

## 6.6 Troubleshooting Common Issues

### 6.6.1 Authentication Issues

1. **Login Errors**:
   - Check Kinde settings
   - Ensure environment variables are properly configured
   - Check Kinde error logs

2. **Permission Issues**:
   - Check role settings in the database
   - Ensure permissions are properly configured in Kinde

### 6.6.2 Database Issues

1. **Connection Errors**:
   - Check the connection string
   - Ensure the database is active and available
   - Check security and network settings

2. **Performance Issues**:
   - Check slow SQL queries
   - Check database indexes
   - Consider query optimization

### 6.6.3 File Storage Issues

1. **Upload Errors**:
   - Check Azure Storage settings
   - Ensure environment variables are properly configured
   - Check container permissions

2. **File Access Issues**:
   - Check CORS policy
   - Check container access permissions
   - Ensure files exist in the correct location

## 6.7 Updates and Routine Maintenance

### 6.7.1 Security Updates

1. **Vulnerability Scanning**:
   - Perform periodic vulnerability scans
   - Use tools like npm audit:
   ```bash
   npm audit
   npm audit fix
   ```

2. **Dependency Updates**:
   - Update dependencies regularly
   - Check security updates for Next.js and other dependencies

### 6.7.2 Routine Maintenance

1. **Database Cleanup**:
   - Clean up old or temporary data
   - Perform database optimization

2. **Storage Cleanup**:
   - Clean up temporary or unused files
   - Check storage usage and increase if necessary

3. **Backups**:
   - Regularly check backup integrity
   - Perform recovery drills to ensure backup validity 