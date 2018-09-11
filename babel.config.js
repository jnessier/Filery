const presets = [
    ["@babel/preset-env", {
        modules: false,
        debug: true,
        targets: {
            ie: "11",
            edge: "15"
        },
        useBuiltIns: "usage"
    }]
];

module.exports = {presets};