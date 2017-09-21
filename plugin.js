// Note(Havvy): This is a hacky way of doing it. A less hacky way would be
//              to add in custom command detection to the Commands plugin.

const InterpolateCommandPlugin = {
    name: "interpolate-command",
    requires: ["commands"],

    init (client, {commands}) {
        const commandTrigger = client.config("command-trigger");
        const firstInterpolateRegexp = new RegExp(`\\{(${commandTrigger}.*?)\\}`)

        const findFirstInterpolate = function (message) {
            const firstInterpolateMatch = message.match(firstInterpolateRegexp);

            if (firstInterpolateMatch) {
                return firstInterpolateMatch[1];
            } else {
                return undefined;
            }
        };

        return {
            handlers: {
                privmsg: function (privmsg) {
                    // If it's already a command, don't do anything.
                    // Note(Havvy) If another plugin does something similar, well, this is hacky...
                    if (commands.isCommand(privmsg)) { return; }

                    const firstInterpolate = findFirstInterpolate(privmsg.message);
                    if (!firstInterpolate) { return; }

                    const psuedoPrivmsg = Object.create(privmsg);
                    psuedoPrivmsg.message = firstInterpolate;

                    return commands.handleCommand(psuedoPrivmsg, firstInterpolate.slice(commandTrigger.length));
                }
            }
        }
    }
};

module.exports = InterpolateCommandPlugin