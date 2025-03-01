// components/charts/BarChart.js
import React from "react";
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, ColumnSeries, Tooltip, BarSeries, LineSeries, DataLabel, Category, Legend } from '@syncfusion/ej2-react-charts';

// สร้าง Template สำหรับ DataLabel
const createTemplate = (color, label, iconSrc) => (args) => `
  <div style="background-color:${color};border-radius:3px;display:flex;align-items:center;padding:5px;">
    <img src="${iconSrc}" style="width:24px;height:24px;" alt="Icon" />
    <div style="color:white;font-family:Roboto;font-size:14px;margin-left:6px;">
      <span style="color: orange;">${label}: \$${args.point.y}</span>
    </div>
  </div>
`;


// ใช้ Template สำหรับแต่ละ Series
const BarChart = ({ dataSource, title }) => {
    const a1Template = createTemplate('#00bdae', 'Car Model A1',);
    const a2Template = createTemplate('#404041', 'Car Model A2',);

    return (

        <ChartComponent id='charts' style={{ textAlign: "center" }} legendSettings={{ enableHighlight: true }}
            primaryXAxis={{
                valueType: 'Category',
                majorGridLines: { width: 0 },

            }}
            primaryYAxis={{
                labelFormat: '{value}%'
            }}
            tooltip={{ enable: true }}
            title={title}
        >

            <Inject services={[ColumnSeries, LineSeries, DataLabel, Category, Legend, Tooltip]} />
            <SeriesCollectionDirective>

                <SeriesDirective
                    dataSource={dataSource.filter(item => item.group === 'atto3')}
                    xName='x' yName='y'
                    type="Column"

                    name="atto3"
                    dataLabel={{
                        // visible: true,
                        position: 'Top',
                        template: a1Template,
                    }}
                />
                <SeriesDirective
                    dataSource={dataSource.filter(item => item.group === 'dolphin')}
                    xName='x' yName='y'
                    type="Column"
                    name="dolphin"
                    dataLabel={{
                        // visible: true,
                        position: 'Top',
                        template: a1Template,
                    }}
                />
                <SeriesDirective
                    dataSource={dataSource.filter(item => item.group === 'm6')}
                    xName='x' yName='y'
                    type="Column"
                    name="m6"
                    dataLabel={{
                        visible: true,
                        position: 'Top',
                        template: a1Template,
                    }}
                />
                <SeriesDirective
                    dataSource={dataSource.filter(item => item.group === 'seal')}
                    xName='x' yName='y'
                    type="Column"
                    name="seal"
                    dataLabel={{
                        visible: true,
                        position: 'Top',
                        template: a1Template,
                    }}
                />
                <SeriesDirective
                    dataSource={dataSource.filter(item => item.group === 'sealion6')}
                    xName='x' yName='y'
                    type="Column"
                    name="sealion6"
                    dataLabel={{
                        visible: true,
                        position: 'Top',
                        template: a1Template,
                    }}
                />
                <SeriesDirective
                    dataSource={dataSource.filter(item => item.group === 'selion7')}
                    xName='x' yName='y'
                    type="Column"
                    name="selion7"
                    dataLabel={{
                        visible: true,
                        position: 'Top',
                        template: a1Template,
                    }}

                />


                {/* <SeriesDirective
                    dataSource={dataSource.filter(item => item.group === 'total')}
                    xName='x' yName='y'
                    type="Line"
                    name="Total"
                    dataLabel={{
                        visible: true,
                        position: 'Top',
                        template: a2Template,
                    }}

                /> */}

            </SeriesCollectionDirective>
        </ChartComponent>
    );
};

export default BarChart;
