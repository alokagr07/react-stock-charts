
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stock-charts";
import {
	BarSeries,
	VolumeProfileSeries,
	CandlestickSeries,
} from "react-stock-charts/lib/series";
import { XAxis, YAxis } from "react-stock-charts/lib/axes";
import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY,
	EdgeIndicator,
} from "react-stock-charts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stock-charts/lib/scale";
import {
	OHLCTooltip,
} from "react-stock-charts/lib/tooltip";
import { change } from "react-stock-charts/lib/indicator";
import { fitWidth } from "react-stock-charts/lib/helper";
import { last } from "react-stock-charts/lib/utils";

class VolumeProfileBySessionChart extends React.Component {
	render() {

		const changeCalculator = change();

		const { type, data: initialData, width, ratio } = this.props;

		const calculatedData = changeCalculator(initialData);
		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(calculatedData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];

		return (
			<ChartCanvas height={400}
				width={width}
				ratio={ratio}
				margin={{ left: 80, right: 80, top: 10, bottom: 30 }}
				type={type}
				seriesName="MSFT"
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>

				<Chart id={2}
					yExtents={[d => d.volume]}
					height={150} origin={(w, h) => [0, h - 150]}
				>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}/>

					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".4s")} />

					<BarSeries yAccessor={d => d.volume}
						widthRatio={0.95}
						opacity={0.3}
						fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}
					/>
				</Chart>
				<Chart id={1}
					yExtents={[d => [d.high, d.low]]}
					padding={{ top: 40, bottom: 20 }}
				>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={5} />
					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<VolumeProfileSeries bySession orient="right" showSessionBackground />
					<CandlestickSeries />
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

					<OHLCTooltip origin={[-40, 0]} />

				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

VolumeProfileBySessionChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

VolumeProfileBySessionChart.defaultProps = {
	type: "svg",
};
VolumeProfileBySessionChart = fitWidth(VolumeProfileBySessionChart);

export default VolumeProfileBySessionChart;
