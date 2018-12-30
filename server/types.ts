const Types = {
    database: Symbol('database'),
    discord:  {
        token:   Symbol('discord.token'),
        options: Symbol('discord.options'),
        client:  Symbol('discord.client'),
    },
    logger:   Symbol('logger'),
    next:     {
        app:     Symbol('next.app'),
        handler: Symbol('next.handler'),
    },
    vault:    {
        client: Symbol('vault.client'),
        config: Symbol('vault.config'),
    },
};

export default Types;
