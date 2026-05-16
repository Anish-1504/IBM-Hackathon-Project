const { sequelize } = require('../src/models');

async function initializeDatabase() {
    try {
        console.log('🔄 Connecting to database...');
        
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        console.log('🔄 Synchronizing database models...');
        
        // Sync all models with database
        // force: false means it won't drop existing tables
        // alter: true means it will alter tables to match models
        await sequelize.sync({ alter: true });
        
        console.log('✅ Database models synchronized successfully.');
        console.log('\n📊 Database schema is ready!');
        
        // Display created tables
        const tables = await sequelize.getQueryInterface().showAllTables();
        console.log('\n📋 Created tables:');
        tables.forEach(table => console.log(`   - ${table}`));
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

// Run initialization
initializeDatabase();

// Made with Bob
