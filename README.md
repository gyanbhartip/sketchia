# sketchia

It is a canvas library using react-native-skia.

### features:

- background image or plain background color.
- 2 drawing modes-
    - cubic: for smoother curves
    - quadratic: for less smoother curves at lower computational cost
- customizable stroke color & thickness
- basic undo/clear etc.
- saving transparent snapshots

## Installation

```sh
# npm
npm install sketchia
```

```sh
#yarn
yarn add sketchia
```

## Usage

```tsx
import { type CanvasControls, SketchiaCanvas } from 'sketchia';
import { useImage } from '@shopify/react-native-skia';

const backgroundImage = useImage('https://picsum.photos/800');
const sketchCanvasRef = useRef<CanvasControls>(null);

return (
	<SketchiaCanvas
		backgroundImage={image}
		canvasColor={'#2A0F4C'}
		mode={'quadratic'}
		onStrokeStart={onStrokeStart}
		onStrokeEnd={onStrokeEnd}
		ref={sketchCanvasRef}
		strokeWeight={6}
		toolColor={'#FCFADA'}
		touchEnabled={isHighlighterActive}
	/>
);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
