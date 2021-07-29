module.exports = function ({ api, __GLOBAL, User }) {
	function getText(...args) {
		const langText = __GLOBAL.language.unsend;
		const getKey = args[0];
		if (!langText.hasOwnProperty(getKey)) throw `${__filename} - Not found key language: ${getKey}`;
		let text = langText[getKey];
		for (let i = args.length; i > 0; i--) {
			let regEx = RegExp(`%${i}`, 'g');
			text = text.replace(regEx, args[i]);
		}
		return text;
	}

	return async function ({ event }) {
		if (__GLOBAL.resendBlocked.includes(parseInt(event.threadID))) return;
		if (!__GLOBAL.messages.some(item => item.msgID == event.messageID)) return;
		var getMsg = __GLOBAL.messages.find(item => item.msgID == event.messageID);
		let tag = await User.getName(event.senderID);
		if (event.senderID != api.getCurrentUserID())
			return api.sendMessage({
				body: tag + ((getMsg.msgBody == '') ? getText('unsentAttachment') : getText('unsent', getMsg.msgBody)),
				mentions: [{ tag, id: event.senderID }]
			}, event.threadID);
	}
}
