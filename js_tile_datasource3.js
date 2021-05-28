async function run(context, timeframe, config, api) {
    try {
        /* Determine the context (Pingdom graph nodes) for the Pingdom data request */
        const nodes = await getGraphNodes(context, timeframe, config, api);

        /* Get the Pingdom timeseries data for the Pingdom graph nodes */
        const data = await Promise.all(nodes.map(async node => {
            return api.fetch('pingdom', node, timeframe);
        }));

        /* Transform the Pingdom timeseries data to that required by a Heatmap */
        return [{item: 'hello'}, {item: 'ben'}, {item: 'yep'},{item: 'hello'}, {item: 'ben'}, {item: 'yep'},{item: 'hello'}, {item: 'ben'}, {item: 'yep'},{item: 'hello'}, {item: 'ben'}, {item: 'yep'}];
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getGraphNodes(context, timeframe, config, api) {
    if (context.sourceId && context.sourceName) {
        if (context.sourceName[0] !== 'Pingdom') {
            throw new Error('Object is not a Pingdom check');
        }
        return [context];
    } else {
        const limit = (config.vars && config.vars.limit) || 10;
        const gremlinQuery = 'g.V().has("sourceName", sourceName).limit(limit).valueMap(true)';
        const bindings = { sourceName: 'Pingdom', limit };
        return api.fetch('graph-custom', context, timeframe, { gremlinQuery, bindings } );
    }
}
