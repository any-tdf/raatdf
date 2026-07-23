import { useState } from 'react';

export const useSystemSettingsDrawer = () => {
	const [open, setOpen] = useState(false);

	return {
		open,
		showDrawer: () => setOpen(true),
		hideDrawer: () => setOpen(false),
	};
};
