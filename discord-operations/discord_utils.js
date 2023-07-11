const xpBrackets = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
const roles = ['Noob Newbie', 'Donut Dunker', 'Whiff Wizard', 'Boop-the-Ball Baron', 'Overtime Obsessive', 'Boostaholic', 'Spinning Turtle Maestro', 'Epic Fails Enthusiast', 'Team-Bumping Troll', 'Ceiling Shot Show-off'];

async function updateRole(member, role) {
	const guildRoles = await member.guild.roles.fetch();
	const roleToAssign = guildRoles.find(r => r.name === role);


	if (!roleToAssign) {
		throw new Error(`Role ${role} does not exist in guild ${member.guild.name}`);
	}

	await member.roles.add(roleToAssign);
}

module.exports = { updateRole, roles, xpBrackets };
