module.exports = {
    apps: [{
        name: "avp-server",
        script: "./bin/www.js",
        instances: 1,
        exec_mode: "fork",
        max_memory_restart: "300M",
        env: {
            NODE_ENV: "development",
            PORT: 3000
        },
        env_production: {
            NODE_ENV: "production"
        }
    }]
}