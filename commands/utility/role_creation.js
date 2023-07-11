const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create_role')
		.setDescription('Creates roles based on users given name and color')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('name of the role')
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName('color')
				.setDescription('Color for role in hex. Get value from [color picker](https://www.google.com/search?q=color+picker).')
				.setRequired(true),
		),
	async execute(interaction) {
		try {
			if (!interaction.member.permissions.has('ADMINISTRATOR')) {
				await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
				return;
			}
			if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
				await interaction.reply({ content: 'I do not have permission to manage roles.', ephemeral: true });
				return;
			}

			const roleName = interaction.options.getString('name');
			const roleColor = interaction.options.getString('color');

			// Check if the role already exists in the guild
			const roleCheck = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());
			if (roleCheck) {
				await interaction.reply({ content: `Role ${roleName} already exists`, ephemeral: true });
				return;
			}

			try {
				const newRole = await interaction.guild.roles.create({
					name: roleName,
					color: roleColor,
					reason: 'New role created as per user request',
				});

				await interaction.reply(`Created new role ${newRole.name} with color ${newRole.hexColor}`);
			}
			catch (error) {
				console.error(`Could not create role: ${error}`);
				await interaction.reply({ content: 'Error creating role', ephemeral: true });
			}
		}
		catch (error) {
			console.log(error);
			await interaction.reply({ content: 'An error occurred while processing your command', ephemeral: true });
		}
	},
};