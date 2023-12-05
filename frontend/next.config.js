const withPlugins = require("next-compose-plugins");

module.exports = withPlugins([], {
    // TODO: figure out if the warning is serious:
    // https://stackoverflow.com/questions/62012994/next-js-api-api-resolved-without-sending-a-response-for-api-employees-this-m
    // https://nextjs.org/docs/pages/building-your-application/routing/api-routes#custom-config
    // api: {
    //     externalResolver: true,
    // },
});
