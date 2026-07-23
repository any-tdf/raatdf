import { fireEvent, render, screen } from '@testing-library/react';
import { Activity, useEffect, useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';

const StatefulProbe = ({ onCleanup }: { onCleanup: () => void }) => {
	const [count, setCount] = useState(0);
	useEffect(() => onCleanup, [onCleanup]);
	return <button onClick={() => setCount((current) => current + 1)}>{count}</button>;
};

describe('React Activity page cache', () => {
	it('preserves state while cleaning up hidden effects', () => {
		const cleanup = vi.fn();
		const { rerender } = render(
			<Activity mode="visible">
				<StatefulProbe onCleanup={cleanup} />
			</Activity>
		);
		fireEvent.click(screen.getByRole('button'));
		expect(screen.getByRole('button')).toHaveTextContent('1');

		rerender(
			<Activity mode="hidden">
				<StatefulProbe onCleanup={cleanup} />
			</Activity>
		);
		expect(cleanup).toHaveBeenCalledTimes(1);

		rerender(
			<Activity mode="visible">
				<StatefulProbe onCleanup={cleanup} />
			</Activity>
		);
		expect(screen.getByRole('button')).toHaveTextContent('1');
	});
});
