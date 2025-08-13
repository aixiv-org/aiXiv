# aiXiv Deployment Guide

## 🎯 **Simple Deployment Workflow**

### **Daily Development → Production (Recommended)**
```bash
# 1. Develop locally
npm start

# 2. Test your changes
npm test

# 3. Deploy to production (automatic!)
git add .
git commit -m "Your commit message"
git push origin main
```

**That's it!** GitHub Actions automatically builds and deploys your app to AWS.

---

## 🏗️ **Infrastructure vs Application Deployment**

### **🚀 Application Deployment (GitHub Actions)**
- **Triggers**: Every push to main branch
- **What it does**: Builds React app → Uploads to S3 → Invalidates CloudFront cache
- **When to use**: Code updates, bug fixes, new features
- **Command**: `git push origin main` (automatic)

### **🔧 Infrastructure Setup (aws-deploy.sh)**
- **Triggers**: Manual execution
- **What it does**: Creates S3 bucket, CloudFront, Route53, SSL certificates
- **When to use**: Initial setup, infrastructure changes, SSL updates
- **Command**: `./aws-deploy.sh`

---

## 🚀 **Initial Setup (One-time only)**

### **First-time deployment or infrastructure changes:**
```bash
# Make script executable
chmod +x aws-deploy.sh

# Run initial setup
./aws-deploy.sh
```

This script will:
- Create S3 bucket
- Set up CloudFront distribution
- Configure Route53 DNS
- Set up SSL certificates

---

## 🔄 **Daily Development Workflow**

### **1. Code Changes**
```bash
# Make your changes
npm start  # Test locally
```

### **2. Deploy to Production**
```bash
git add .
git commit -m "Add new feature"
git push origin main
```

### **3. Monitor Deployment**
- Check GitHub Actions tab
- See build and deployment progress
- Wait 5-10 minutes for CloudFront propagation

---

## 🌍 **Environment Variables**

### **Local Development (.env file):**
```bash
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_key
REACT_APP_API_URL=https://api.aixiv.co
```

### **Production (GitHub Secrets):**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

---

## ❓ **FAQ**

**Q: How do I deploy code changes?**
A: Just push to main branch! GitHub Actions handles everything.

**Q: When do I use aws-deploy.sh?**
A: Only for initial setup or infrastructure changes (S3, CloudFront, DNS, SSL).

**Q: What if GitHub Actions fails?**
A: Check the logs. If it's an infrastructure issue, run `./aws-deploy.sh` first.

**Q: Can I update SSL certificates via GitHub Actions?**
A: No, use `./aws-deploy.sh` for infrastructure changes.

---

## ✅ **Best Practices**

1. **Always test locally first** → `npm start`
2. **Use descriptive commit messages**
3. **Push to main for automatic deployment**
4. **Monitor GitHub Actions for deployment status**
5. **Use aws-deploy.sh only for infrastructure changes**

---

## 🆘 **Troubleshooting**

### **Application deployment failed?**
1. Check GitHub Actions logs
2. Verify AWS credentials in GitHub Secrets
3. Check if S3 bucket exists and is accessible

### **Infrastructure issues?**
1. Run `./aws-deploy.sh` to fix infrastructure
2. Check AWS Console for S3, CloudFront, Route53 status
3. Verify SSL certificate validation

### **Site not updating?**
1. Wait 5-10 minutes for CloudFront propagation
2. Check if CloudFront invalidation succeeded
3. Verify Route53 DNS settings

---

## 📋 **Deployment Summary**

| Task | Tool | When |
|------|------|------|
| **Code Updates** | GitHub Actions | Every push to main |
| **Infrastructure** | aws-deploy.sh | Initial setup, changes |
| **Local Testing** | npm start | Before every commit |
| **Emergency Deploy** | aws-deploy.sh | If GitHub Actions fails | 