import logo from "./logo.svg";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import Dygraph from "dygraphs";
import { DFT, ComplexArray, MagPhaArray } from "fft";

const inputSize = 512;
const data = [[0, 1]];
for (let i = 1; i < inputSize; i += 1) {
  data.push([i, Math.round(Math.random() * 10 - 5) + data[i - 1][1]]);
}

function App() {
  const [chart, setChart] = useState(null);
  const ref = useRef();

  const dft = new DFT(inputSize);
  const ca = ComplexArray.createFromArray(data.map(([, x]) => x));
  const iCa = dft.calculate(ca);
  const mp = new MagPhaArray(iCa);
  mp.deleteAllOthersFrequencies(1, 2, 3, 4, 5, 6);
  const result = dft.iCalculate(mp.getPreparedComplexArray());
  result.forEach(({ re }, id) => {
    data[id][2] = re;
  });
  useEffect(() => {
    if (ref?.current && !chart) {
      setChart(new Dygraph(ref.current, data, { labels: ["x", "y1", "y2"] }));
    }
  }, [chart]);

  const calculateChart = (value) => {
    const mp = new MagPhaArray(iCa);
    const frequencies = new Array(value + 1).fill(0).map((x, id) => id);
    mp.deleteAllOthersFrequencies(...frequencies);
    const result = dft.iCalculate(mp.getPreparedComplexArray());
    result.forEach(({ re }, id) => {
      data[id][2] = re;
    });
    chart.updateOptions({ file: data });
  };

  return (
    <div style={{ width: 500 }}>
      <div ref={ref}></div>
      <input
        type="range"
        id="deleteAllOtherFrequencies"
        name="deleteAllOtherFrequencies"
        min="0"
        max={inputSize / 2}
        onChange={(event) => calculateChart(event.target.valueAsNumber)}
        style={{ alignSelf: "center" }}
      />
    </div>
  );
}

export default App;
