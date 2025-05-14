// my panels blended into the background too much
// so this helper is to add a little more contrast (a darker shadow) behind the panels

export default function PanelBackground() {
  return (
    <div className="absolute inset-0 -z-5 bg-gray-300 backdrop-blur-md blur-sm" />
  );
}
