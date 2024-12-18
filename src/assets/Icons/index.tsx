import { Path } from '@shopify/react-native-skia';

export const ClearIcon = () => (
	<Path
		color="#FAFAFA"
		path="M6 18L18 6M6 6l12 12"
		strokeCap={'round'}
		strokeJoin={'round'}
		strokeWidth={1.5}
		style={'stroke'}
		transform={[{ translate: [4, 5] }]}
	/>
);

export const SaveIcon = () => (
	<Path
		color="#FAFAFA"
		path="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
		strokeCap={'round'}
		strokeJoin={'round'}
		strokeWidth={1.5}
		style={'stroke'}
		transform={[{ translate: [4, 5] }]}
	/>
);

export const UndoIcon = () => (
	<Path
		color="#FAFAFA"
		path="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-6"
		strokeCap={'round'}
		strokeJoin={'round'}
		strokeWidth={1.5}
		style={'stroke'}
		transform={[{ translate: [4, 5] }]}
	/>
);
