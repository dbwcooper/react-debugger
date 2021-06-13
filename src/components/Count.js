function App(props) {
  console.log('Cpunt: ');
  return (
    <div className="child">
      <div>Child: {props.count}</div>
    </div>
  );
}

export default App;
