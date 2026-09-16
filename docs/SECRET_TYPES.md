# Secret Types & Security Management

This document outlines the types of secrets used in the Veritas Crypto Fund project and best practices for managing them. For additional context, refer to [GitHub's Secret Types Documentation](https://docs.github.com/en/code-security/reference/secret-security/secret-types).

## Overview

Secrets are sensitive information that should never be committed to version control or exposed in public repositories. This project handles several types of secrets that require careful management.

## Secrets in Veritas Crypto Fund

### 1. **Database Credentials**

**Type:** Database Connection Strings

**Location:** Environment variables (`.env` file - **DO NOT COMMIT**)

**Examples:**
- `DATABASE_URL` - SQLite database path
- `DB_USERNAME` - Database user credentials
- `DB_PASSWORD` - Database password

**Risk Level:** ��� Critical

**Management:**
- Store in `.env` file (listed in `.gitignore`)
- Use GitHub Secrets for CI/CD pipelines
- Rotate credentials regularly
- Use least privilege principles for database accounts

**Reference:** [GitHub Secret Scanning - Database Credentials](https://docs.github.com/en/code-security/secret-scanning/secret-scanning-patterns#database-credentials)

---

### 2. **API Keys & Tokens**

**Type:** Authentication Tokens

**Location:** Environment variables (`.env` file - **DO NOT COMMIT**)

**Examples:**
- JWT Secrets (`JWT_SECRET`)
- API Keys for external services
- Authentication tokens

**Risk Level:** 🔴 Critical

**Management:**
- Generate strong, random keys
- Store securely in environment variables
- Rotate regularly
- Use different keys for development, staging, and production
- Never hardcode in source code

**Reference:** [GitHub Secret Scanning - API Keys](https://docs.github.com/en/code-security/secret-scanning/secret-scanning-patterns#api-keys)

---

### 3. **User Passwords & Credentials**

**Type:** User Authentication Data

**Location:** SQLite Database (encrypted/hashed)

**Details:**
- User passwords are stored using bcrypt hashing
- Should never be logged or exposed in error messages
- Must not be transmitted over unencrypted connections

**Risk Level:** 🔴 Critical

**Management:**
- Always hash passwords before storage using bcrypt
- Implement proper password validation
- Use HTTPS/TLS for all communications
- Implement rate limiting on authentication endpoints
- Log authentication attempts securely

**Reference:** [GitHub Secret Scanning - Personal Access Tokens](https://docs.github.com/en/code-security/secret-scanning/secret-scanning-patterns#personal-access-tokens)

---

### 4. **Cryptocurrency Wallet Keys** (Fund-Specific)

**Type:** Private Keys, Seed Phrases

**Location:** Encrypted storage (NOT in repository)

**Risk Level:** 🔴 CRITICAL - Highest Priority

**Management:**
- Store in hardware wallets or encrypted vaults
- Never commit to repository
- Use multi-signature wallets for fund management
- Implement strict access controls
- Maintain secure backup procedures
- Use environment variables for non-production testing only

**Reference:** [GitHub Secret Scanning - Cryptocurrency Keys](https://docs.github.com/en/code-security/secret-scanning/secret-scanning-patterns#cryptocurrency)

---

### 5. **Session & Bearer Tokens**

**Type:** JWT Tokens, Session IDs

**Location:** Memory/Cache (temporary), secure cookies

**Risk Level:** 🟠 High

**Management:**
- Set appropriate expiration times
- Implement token refresh mechanisms
- Store securely (HttpOnly cookies for web)
- Invalidate on logout
- Monitor for suspicious token usage

---

## Security Best Practices

### ✅ DO:
- ✅ Use `.env` files for local development (add to `.gitignore`)
- ✅ Use GitHub Secrets for CI/CD workflows
- ✅ Implement environment-specific configurations
- ✅ Rotate secrets regularly
- ✅ Use strong, random secret generation
- ✅ Enable GitHub Secret Scanning on your repository
- ✅ Review `.gitignore` to prevent accidental commits
- ✅ Use encrypted connections (HTTPS/TLS)

### ❌ DON'T:
- ❌ Commit `.env` files or secrets to version control
- ❌ Hardcode secrets in source code
- ❌ Use weak or predictable secrets
- ❌ Share secrets via unencrypted channels
- ❌ Log sensitive information
- ❌ Use the same secret across environments
- ❌ Commit private keys or seed phrases

## GitHub Security Features

### Secret Scanning

GitHub automatically scans repositories for known secret patterns. The Veritas Crypto Fund repository should have Secret Scanning enabled to detect accidental commits of:
- API Keys
- Personal Access Tokens
- Database Credentials
- Private Keys
- And more...

**To enable:**
1. Go to repository Settings → Code Security & Analysis
2. Enable "Secret Scanning"
3. Optionally enable "Secret Scanning Push Protection" to prevent pushes containing secrets

**Reference:** [GitHub Secret Scanning Documentation](https://docs.github.com/en/code-security/secret-scanning)

### Dependabot Alerts

Monitor dependencies for known vulnerabilities that could expose secrets or compromise security.

**Reference:** [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)

---

## Environment Configuration

### `.env.example` (Safe Template)

Create a `.env.example` file showing the required environment variables without actual values:

```env
# Database Configuration
DATABASE_URL=sqlite:./userData.db
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# Authentication
JWT_SECRET=your_jwt_secret_key

# Crypto Fund Specific
WALLET_ADDRESS=your_wallet_address
API_KEY=your_api_key

# Environment
NODE_ENV=development
PORT=3000
```

### `.gitignore` (Essential)

Ensure your `.gitignore` includes:

```
.env
.env.local
.env.*.local
.env.development
.env.production
.env.test
*.pem
*.key
.DS_Store
node_modules/
```

---

## Incident Response

If you suspect a secret has been compromised:

1. **Immediately rotate** the compromised secret
2. **Audit logs** to check for unauthorized access
3. **Search repository history** for any commits containing the secret
4. **Notify affected parties** if necessary
5. **Enable alerts** for future unauthorized access attempts
6. **Use Git filter-branch** or `git-filter-repo` to remove secrets from history if needed

**Reference:** [GitHub's Guide to Removing Sensitive Data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

---

## References

- [GitHub Secret Types Documentation](https://docs.github.com/en/code-security/reference/secret-security/secret-types)
- [Secret Scanning Patterns](https://docs.github.com/en/code-security/secret-scanning/secret-scanning-patterns)
- [Protecting Sensitive Data with Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [Removing Sensitive Data from Repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

---

**Last Updated:** September 16, 2026

**For Questions:** Please contact the project maintainers or refer to GitHub's security documentation.
