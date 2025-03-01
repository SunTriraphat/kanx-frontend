import React from "react";
import {
  AccumulationChartComponent,
  AccumulationSeriesCollectionDirective,
  AccumulationSeriesDirective,
  Inject,
  AccumulationLegend,
  PieSeries,
  AccumulationTooltip,
  AccumulationDataLabel,
} from "@syncfusion/ej2-react-charts";
import { DatePicker, InputGroup, SelectPicker } from "rsuite";

const SAMPLE_CSS = `
    .control-fluid {
        padding: 0px !important;,
         fontFamily: "Prompt"!important;,
      
    }`;

const PieChart = ({ dataSource, title }) => {
  const sanitizeId = (title) =>
    title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();

  const onChartLoad = () => {
    const element = document.getElementById(sanitizeId(title));
    if (element) {
      element.setAttribute("title", "");
    }
  };

  const load = (args) => {
    let selectedTheme = location.hash.split("/")[1] || "Fluent2";
    args.accumulation.theme = (
      selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)
    )
      .replace(/-dark/i, "Dark")
      .replace(/light/i, "Light")
      .replace(/contrast/i, "Contrast")
      .replace(/-highContrast/i, "HighContrast");
  };

  return (
    <div className="control-pane">
      <style>{SAMPLE_CSS}</style>
      <div className="control-section row">
        <AccumulationChartComponent
          id={title.replace(/\s+/g, "-")}
          title={title}
          palette={["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC133"]}
          load={load}
          legendSettings={{
            visible: true,
            position: "Bottom",
            textStyle: {
              fontWeight: "600",
              fontSize: "16px",
              fontFamily: "Prompt",
            },
          }}
          enableSmartLabels={true}
          enableAnimation={true}
          center={{ x: "50%", y: "50%" }}
          enableBorderOnMouseMove={false}
          tooltip={{
            enable: true,
            format: "<b>${point.x}</b> <br> <b>${point.y}%</b>",
            header: "",
            enableHighlight: true,
          }}
          loaded={onChartLoad}
        >
          <Inject
            services={[
              AccumulationLegend,
              PieSeries,
              AccumulationTooltip,
              AccumulationDataLabel,
            ]}
          />
          <AccumulationSeriesCollectionDirective>
            <AccumulationSeriesDirective
              dataSource={dataSource}
              name="count"
              xName="x"
              yName="y"
              explode={true}
              explodeOffset="10%"
              explodeIndex={0}
              startAngle={55}
              dataLabel={{
                visible: true,
                position: "Outside",
                name: "text",
                font: { fontFamily: "Prompt", fontSize: "16px" },
                connectorStyle: {
                  length: "20px",
                  type: "Curve",
                  fontFamily: "Prompt",
                },
              }}
              radius="70%"
            />
          </AccumulationSeriesCollectionDirective>
        </AccumulationChartComponent>
      </div>
    </div>
  );
};

export default PieChart;
