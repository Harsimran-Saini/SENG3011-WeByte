import React, { Component } from 'react';
import Select from 'react-select'
import Tabletop from 'tabletop';
import ReactCardFlip from "react-card-flip";
import { Scatter, Line, Pie, Bar } from "react-chartjs-2";
import casesJSON from './cases.json';
import TrendGraph from './TrendGraph.js';
import TrendGraphWrapper from './TrendGraphWrapper.js';

function matchUp(country) {
  console.log("cJ", country)
  for (var i = 0; i < casesJSON["Countries"].length; i++) {
    if (country === casesJSON["Countries"][i]["Country"]) {
      console.log("aaa");
      return casesJSON["Countries"][i];
    }
  }
  return {};
}

class RegressionCard extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
      isFlipped: false,
      showTrendline: false,
      options: {},
      keys: [],
      graphType: '',
      dataSelected: "promed_covid_data"
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleDataSelectChange = this.handleDataSelectChange.bind(this);
    this.onClickShowTrendline = this.onClickShowTrendline.bind(this);
    this.handleCovidCountrySearch = this.handleCovidCountrySearch.bind(this);
  }


  componentDidMount() {
    Tabletop.init({
      key: '1BCNRtoJorviGwx1aZia5o8ObbshvLVuIc7Xjgn5xrvc',
      callback: googleData => {

        //Graph Type
        var graphType = googleData["Graph Selection"].elements[0]["Graph Type"];
        console.log(googleData[graphType])

        //Graph Keys
        var keys = Object.values(googleData[graphType].elements[0]);
        keys.shift();
        console.log("keys", keys)


        //Graph Values
        var data = googleData[graphType].elements;
        data.shift();
        console.log("data", data)
        this.setState({
          data: data,
          keys: keys,
          graphType: graphType
        })
      },
      simpleSheet: false
    });

  }

  handleDataSelectChange(event) {
    this.setState({
      dataSelected: event.value
    });
  }

  handleClick() {
    this.setState(({ isFlipped }) => ({ isFlipped: !isFlipped }));
  }

  onClickShowTrendline() {
    this.setState(({ showTrendline }) => ({ showTrendline: !showTrendline }));
  }

  handleCovidCountrySearch() {
    this.setState({
      dataSelected: "covid_panama_data"
    })
  }

  render() {
    let graph;
    let analysis;

    if (this.state.dataSelected == "promed_covid_data") {
      analysis = (<div>
        <p>Model r^2 score: 0.5895063739828166</p>
        <p>Pearsons correlation and p-value: (0.7677931843815862, 1.8525830029630665e-06)</p>
        <p>Spearmans correlation and p-value: SpearmanrResult(correlation=0.6513409961685823, pvalue=0.00017397029304976614)</p>
        <p>Kendalls correlation and p-value: KendalltauResult(correlation=0.49735449735449727, pvalue=0.00012167840449705953)</p>
      </div>)

      var data = { "datasets": [{ "label": "Ireland", "data": [{ "x": 93532, "y": 44 }], "backgroundColor": "rgb(54,113,138)" }, { "label": "Australia", "data": [{ "x": 56920, "y": 130 }], "backgroundColor": "rgb(130,57,53)" }, { "label": "Argentina", "data": [{ "x": 1629594, "y": 239 }], "backgroundColor": "rgb(25,134,130)" }, { "label": "Egypt", "data": [{ "x": 139471, "y": 129 }], "backgroundColor": "rgb(3,136,199)" }, { "label": "Jordan", "data": [{ "x": 295765, "y": 101 }], "backgroundColor": "rgb(40,176,213)" }, { "label": "Norway", "data": [{ "x": 49803, "y": 17 }], "backgroundColor": "rgb(80,241,166)" }, { "label": "Peru", "data": [{ "x": 1015137, "y": 244 }], "backgroundColor": "rgb(119,149,168)" }, { "label": "Saudi Arabia", "data": [{ "x": 362878, "y": 125 }], "backgroundColor": "rgb(13,168,212)" }, { "label": "Singapore", "data": [{ "x": 58629, "y": 134 }], "backgroundColor": "rgb(208,159,25)" }, { "label": "South Africa", "data": [{ "x": 1073887, "y": 267 }], "backgroundColor": "rgb(94,55,132)" }, { "label": "Spain", "data": [{ "x": 1928265, "y": 422 }], "backgroundColor": "rgb(124,144,199)" }, { "label": "France", "data": [{ "x": 2697014, "y": 419 }], "backgroundColor": "rgb(42,52,184)" }, { "label": "Thailand", "data": [{ "x": 7379, "y": 212 }], "backgroundColor": "rgb(30,237,70)" }, { "label": "Ukraine", "data": [{ "x": 1096855, "y": 202 }], "backgroundColor": "rgb(89,196,195)" }, { "label": "Sweden", "data": [{ "x": 437379, "y": 131 }], "backgroundColor": "rgb(31,49,180)" }, { "label": "Slovenia", "data": [{ "x": 123950, "y": 73 }], "backgroundColor": "rgb(84,204,162)" }, { "label": "Qatar", "data": [{ "x": 144042, "y": 64 }], "backgroundColor": "rgb(81,20,200)" }, { "label": "Portugal", "data": [{ "x": 420629, "y": 57 }], "backgroundColor": "rgb(159,73,94)" }, { "label": "Philippines", "data": [{ "x": 475820, "y": 229 }], "backgroundColor": "rgb(213,225,104)" }, { "label": "Panama", "data": [{ "x": 249733, "y": 90 }], "backgroundColor": "rgb(101,85,16)" }, { "label": "Nigeria", "data": [{ "x": 88587, "y": 203 }], "backgroundColor": "rgb(18,61,203)" }, { "label": "Netherlands", "data": [{ "x": 816616, "y": 242 }], "backgroundColor": "rgb(246,141,184)" }, { "label": "Nepal", "data": [{ "x": 261019, "y": 141 }], "backgroundColor": "rgb(34,240,115)" }, { "label": "Morocco", "data": [{ "x": 440970, "y": 136 }], "backgroundColor": "rgb(108,251,229)" }, { "label": "Mongolia", "data": [{ "x": 1242, "y": 0 }], "backgroundColor": "rgb(131,119,214)" }, { "label": "Mexico", "data": [{ "x": 1437185, "y": 233 }], "backgroundColor": "rgb(166,147,149)" }, { "label": "Lebanon", "data": [{ "x": 183888, "y": 174 }], "backgroundColor": "rgb(24,227,215)" }, { "label": "Japan", "data": [{ "x": 239068, "y": 328 }], "backgroundColor": "rgb(32,159,151)" }] };

      if (this.state.showTrendline) {
        var trendline = { "label": "Trendline", "pointRadius": 0, "showLine": true, "data": [{ "x": 1.0, "y": 102.0 }, { "x": 10034.441471571909, "y": 103.0 }, { "x": 20067.88294314381, "y": 104.0 }, { "x": 30101.324414715717, "y": 105.0 }, { "x": 40134.765886287634, "y": 107.0 }, { "x": 50168.20735785953, "y": 108.0 }, { "x": 60201.64882943143, "y": 109.0 }, { "x": 70235.09030100335, "y": 110.0 }, { "x": 80268.53177257525, "y": 111.0 }, { "x": 90301.97324414717, "y": 113.0 }, { "x": 100335.41471571906, "y": 114.0 }, { "x": 110368.85618729098, "y": 115.0 }, { "x": 120402.29765886287, "y": 116.0 }, { "x": 130435.73913043477, "y": 118.0 }, { "x": 140469.1806020067, "y": 119.0 }, { "x": 150502.6220735786, "y": 120.0 }, { "x": 160536.0635451505, "y": 121.0 }, { "x": 170569.50501672245, "y": 123.0 }, { "x": 180602.94648829428, "y": 124.0 }, { "x": 190636.38795986626, "y": 125.0 }, { "x": 200669.8294314381, "y": 126.0 }, { "x": 210703.27090301004, "y": 127.0 }, { "x": 220736.71237458198, "y": 129.0 }, { "x": 230770.15384615387, "y": 130.0 }, { "x": 240803.59531772573, "y": 131.0 }, { "x": 250837.0367892977, "y": 132.0 }, { "x": 260870.4782608696, "y": 134.0 }, { "x": 270903.9197324415, "y": 135.0 }, { "x": 280937.3612040134, "y": 136.0 }, { "x": 290970.8026755853, "y": 137.0 }, { "x": 301004.2441471572, "y": 139.0 }, { "x": 311037.6856187291, "y": 140.0 }, { "x": 321071.127090301, "y": 141.0 }, { "x": 331104.5685618729, "y": 142.0 }, { "x": 341138.01003344485, "y": 143.0 }, { "x": 351171.4515050167, "y": 145.0 }, { "x": 361204.89297658857, "y": 146.0 }, { "x": 371238.33444816055, "y": 147.0 }, { "x": 381271.7759197325, "y": 148.0 }, { "x": 391305.2173913044, "y": 150.0 }, { "x": 401338.6588628762, "y": 151.0 }, { "x": 411372.1003344481, "y": 152.0 }, { "x": 421405.5418060201, "y": 153.0 }, { "x": 431438.98327759205, "y": 155.0 }, { "x": 441472.4247491639, "y": 156.0 }, { "x": 451505.86622073577, "y": 157.0 }, { "x": 461539.30769230775, "y": 158.0 }, { "x": 471572.7491638796, "y": 159.0 }, { "x": 481606.19063545146, "y": 161.0 }, { "x": 491639.63210702344, "y": 162.0 }, { "x": 501673.0735785954, "y": 163.0 }, { "x": 511706.51505016716, "y": 164.0 }, { "x": 521739.9565217392, "y": 166.0 }, { "x": 531773.397993311, "y": 167.0 }, { "x": 541806.839464883, "y": 168.0 }, { "x": 551840.2809364549, "y": 169.0 }, { "x": 561873.7224080268, "y": 171.0 }, { "x": 571907.1638795987, "y": 172.0 }, { "x": 581940.6053511706, "y": 173.0 }, { "x": 591974.0468227424, "y": 174.0 }, { "x": 602007.4882943144, "y": 175.0 }, { "x": 612040.9297658863, "y": 177.0 }, { "x": 622074.3712374582, "y": 178.0 }, { "x": 632107.8127090301, "y": 179.0 }, { "x": 642141.254180602, "y": 180.0 }, { "x": 652174.695652174, "y": 182.0 }, { "x": 662208.137123746, "y": 183.0 }, { "x": 672241.5785953178, "y": 184.0 }, { "x": 682275.0200668897, "y": 185.0 }, { "x": 692308.4615384616, "y": 187.0 }, { "x": 702341.9030100334, "y": 188.0 }, { "x": 712375.3444816053, "y": 189.0 }, { "x": 722408.7859531774, "y": 190.0 }, { "x": 732442.2274247492, "y": 191.0 }, { "x": 742475.6688963211, "y": 193.0 }, { "x": 752509.110367893, "y": 194.0 }, { "x": 762542.5518394648, "y": 195.0 }, { "x": 772575.9933110368, "y": 196.0 }, { "x": 782609.4347826088, "y": 198.0 }, { "x": 792642.8762541807, "y": 199.0 }, { "x": 802676.3177257525, "y": 200.0 }, { "x": 812709.7591973244, "y": 201.0 }, { "x": 822743.2006688962, "y": 203.0 }, { "x": 832776.6421404681, "y": 204.0 }, { "x": 842810.0836120402, "y": 205.0 }, { "x": 852843.5250836121, "y": 206.0 }, { "x": 862876.9665551841, "y": 207.0 }, { "x": 872910.4080267559, "y": 209.0 }, { "x": 882943.8494983278, "y": 210.0 }, { "x": 892977.2909698997, "y": 211.0 }, { "x": 903010.7324414715, "y": 212.0 }, { "x": 913044.1739130436, "y": 214.0 }, { "x": 923077.6153846155, "y": 215.0 }, { "x": 933111.0568561872, "y": 216.0 }, { "x": 943144.4983277592, "y": 217.0 }, { "x": 953177.9397993312, "y": 219.0 }, { "x": 963211.3812709029, "y": 220.0 }, { "x": 973244.822742475, "y": 221.0 }, { "x": 983278.2642140469, "y": 222.0 }, { "x": 993311.7056856188, "y": 223.0 }, { "x": 1003345.1471571908, "y": 225.0 }, { "x": 1013378.5886287626, "y": 226.0 }, { "x": 1023412.0301003343, "y": 227.0 }, { "x": 1033445.4715719064, "y": 228.0 }, { "x": 1043478.9130434784, "y": 230.0 }, { "x": 1053512.3545150505, "y": 231.0 }, { "x": 1063545.795986622, "y": 232.0 }, { "x": 1073579.2374581941, "y": 233.0 }, { "x": 1083612.678929766, "y": 235.0 }, { "x": 1093646.1204013377, "y": 236.0 }, { "x": 1103679.5618729098, "y": 237.0 }, { "x": 1113713.0033444816, "y": 238.0 }, { "x": 1123746.4448160536, "y": 239.0 }, { "x": 1133779.8862876254, "y": 241.0 }, { "x": 1143813.3277591974, "y": 242.0 }, { "x": 1153846.7692307692, "y": 243.0 }, { "x": 1163880.2107023413, "y": 244.0 }, { "x": 1173913.652173913, "y": 246.0 }, { "x": 1183947.093645485, "y": 247.0 }, { "x": 1193980.535117057, "y": 248.0 }, { "x": 1204013.9765886287, "y": 249.0 }, { "x": 1214047.4180602008, "y": 250.0 }, { "x": 1224080.8595317726, "y": 252.0 }, { "x": 1234114.3010033446, "y": 253.0 }, { "x": 1244147.7424749164, "y": 254.0 }, { "x": 1254181.1839464884, "y": 255.0 }, { "x": 1264214.6254180602, "y": 257.0 }, { "x": 1274248.0668896323, "y": 258.0 }, { "x": 1284281.508361204, "y": 259.0 }, { "x": 1294314.9498327759, "y": 260.0 }, { "x": 1304348.391304348, "y": 262.0 }, { "x": 1314381.8327759195, "y": 263.0 }, { "x": 1324415.2742474915, "y": 264.0 }, { "x": 1334448.7157190635, "y": 265.0 }, { "x": 1344482.1571906356, "y": 266.0 }, { "x": 1354515.5986622074, "y": 268.0 }, { "x": 1364549.0401337794, "y": 269.0 }, { "x": 1374582.4816053512, "y": 270.0 }, { "x": 1384615.9230769232, "y": 271.0 }, { "x": 1394649.364548495, "y": 273.0 }, { "x": 1404682.8060200668, "y": 274.0 }, { "x": 1414716.2474916386, "y": 275.0 }, { "x": 1424749.688963211, "y": 276.0 }, { "x": 1434783.1304347827, "y": 278.0 }, { "x": 1444816.5719063543, "y": 279.0 }, { "x": 1454850.0133779263, "y": 280.0 }, { "x": 1464883.4548494983, "y": 281.0 }, { "x": 1474916.8963210704, "y": 282.0 }, { "x": 1484950.3377926422, "y": 284.0 }, { "x": 1494983.779264214, "y": 285.0 }, { "x": 1505017.220735786, "y": 286.0 }, { "x": 1515050.6622073578, "y": 287.0 }, { "x": 1525084.10367893, "y": 289.0 }, { "x": 1535117.5451505017, "y": 290.0 }, { "x": 1545150.9866220737, "y": 291.0 }, { "x": 1555184.4280936457, "y": 292.0 }, { "x": 1565217.8695652175, "y": 294.0 }, { "x": 1575251.311036789, "y": 295.0 }, { "x": 1585284.7525083614, "y": 296.0 }, { "x": 1595318.1939799332, "y": 297.0 }, { "x": 1605351.635451505, "y": 298.0 }, { "x": 1615385.0769230768, "y": 300.0 }, { "x": 1625418.5183946488, "y": 301.0 }, { "x": 1635451.9598662208, "y": 302.0 }, { "x": 1645485.4013377924, "y": 303.0 }, { "x": 1655518.8428093647, "y": 305.0 }, { "x": 1665552.2842809362, "y": 306.0 }, { "x": 1675585.7257525085, "y": 307.0 }, { "x": 1685619.1672240803, "y": 308.0 }, { "x": 1695652.6086956526, "y": 310.0 }, { "x": 1705686.0501672241, "y": 311.0 }, { "x": 1715719.491638796, "y": 312.0 }, { "x": 1725752.9331103682, "y": 313.0 }, { "x": 1735786.3745819398, "y": 314.0 }, { "x": 1745819.8160535118, "y": 316.0 }, { "x": 1755853.2575250838, "y": 317.0 }, { "x": 1765886.6989966556, "y": 318.0 }, { "x": 1775920.1404682274, "y": 319.0 }, { "x": 1785953.5819397997, "y": 321.0 }, { "x": 1795987.0234113713, "y": 322.0 }, { "x": 1806020.4648829438, "y": 323.0 }, { "x": 1816053.906354515, "y": 324.0 }, { "x": 1826087.347826087, "y": 326.0 }, { "x": 1836120.789297659, "y": 327.0 }, { "x": 1846154.230769231, "y": 328.0 }, { "x": 1856187.6722408028, "y": 329.0 }, { "x": 1866221.1137123744, "y": 330.0 }, { "x": 1876254.5551839462, "y": 332.0 }, { "x": 1886287.9966555184, "y": 333.0 }, { "x": 1896321.4381270902, "y": 334.0 }, { "x": 1906354.8795986625, "y": 335.0 }, { "x": 1916388.3210702343, "y": 337.0 }, { "x": 1926421.7625418059, "y": 338.0 }, { "x": 1936455.2040133781, "y": 339.0 }, { "x": 1946488.64548495, "y": 340.0 }, { "x": 1956522.0869565215, "y": 342.0 }, { "x": 1966555.5284280938, "y": 343.0 }, { "x": 1976588.9698996656, "y": 344.0 }, { "x": 1986622.4113712376, "y": 345.0 }, { "x": 1996655.8528428092, "y": 346.0 }, { "x": 2006689.2943143812, "y": 348.0 }, { "x": 2016722.7357859528, "y": 349.0 }, { "x": 2026756.1772575253, "y": 350.0 }, { "x": 2036789.6187290968, "y": 351.0 }, { "x": 2046823.0602006686, "y": 353.0 }, { "x": 2056856.501672241, "y": 354.0 }, { "x": 2066889.9431438127, "y": 355.0 }, { "x": 2076923.3846153847, "y": 356.0 }, { "x": 2086956.8260869563, "y": 358.0 }, { "x": 2096990.2675585288, "y": 359.0 }, { "x": 2107023.709030101, "y": 360.0 }, { "x": 2117057.1505016717, "y": 361.0 }, { "x": 2127090.591973244, "y": 362.0 }, { "x": 2137124.033444816, "y": 364.0 }, { "x": 2147157.4749163883, "y": 365.0 }, { "x": 2157190.91638796, "y": 366.0 }, { "x": 2167224.357859532, "y": 367.0 }, { "x": 2177257.799331104, "y": 369.0 }, { "x": 2187291.2408026755, "y": 370.0 }, { "x": 2197324.6822742475, "y": 371.0 }, { "x": 2207358.12374582, "y": 372.0 }, { "x": 2217391.565217392, "y": 374.0 }, { "x": 2227425.006688963, "y": 375.0 }, { "x": 2237458.448160535, "y": 376.0 }, { "x": 2247491.8896321068, "y": 377.0 }, { "x": 2257525.3311036793, "y": 378.0 }, { "x": 2267558.772575251, "y": 380.0 }, { "x": 2277592.2140468233, "y": 381.0 }, { "x": 2287625.655518395, "y": 382.0 }, { "x": 2297659.0969899665, "y": 383.0 }, { "x": 2307692.5384615385, "y": 385.0 }, { "x": 2317725.9799331105, "y": 386.0 }, { "x": 2327759.4214046826, "y": 387.0 }, { "x": 2337792.862876254, "y": 388.0 }, { "x": 2347826.304347826, "y": 390.0 }, { "x": 2357859.745819398, "y": 391.0 }, { "x": 2367893.18729097, "y": 392.0 }, { "x": 2377926.628762542, "y": 393.0 }, { "x": 2387960.070234114, "y": 394.0 }, { "x": 2397993.511705686, "y": 396.0 }, { "x": 2408026.953177257, "y": 397.0 }, { "x": 2418060.394648829, "y": 398.0 }, { "x": 2428093.836120401, "y": 399.0 }, { "x": 2438127.277591973, "y": 401.0 }, { "x": 2448160.719063545, "y": 402.0 }, { "x": 2458194.1605351167, "y": 403.0 }, { "x": 2468227.602006689, "y": 404.0 }, { "x": 2478261.0434782607, "y": 406.0 }, { "x": 2488294.4849498332, "y": 407.0 }, { "x": 2498327.926421405, "y": 408.0 }, { "x": 2508361.367892977, "y": 409.0 }, { "x": 2518394.8093645484, "y": 410.0 }, { "x": 2528428.2508361205, "y": 412.0 }, { "x": 2538461.6923076925, "y": 413.0 }, { "x": 2548495.1337792645, "y": 414.0 }, { "x": 2558528.575250836, "y": 415.0 }, { "x": 2568562.016722408, "y": 417.0 }, { "x": 2578595.45819398, "y": 418.0 }, { "x": 2588628.8996655517, "y": 419.0 }, { "x": 2598662.341137124, "y": 420.0 }, { "x": 2608695.782608696, "y": 422.0 }, { "x": 2618729.2240802683, "y": 423.0 }, { "x": 2628762.66555184, "y": 424.0 }, { "x": 2638796.1070234114, "y": 425.0 }, { "x": 2648829.548494984, "y": 426.0 }, { "x": 2658862.9899665555, "y": 428.0 }, { "x": 2668896.431438127, "y": 429.0 }, { "x": 2678929.872909699, "y": 430.0 }, { "x": 2688963.314381271, "y": 431.0 }, { "x": 2698996.7558528427, "y": 433.0 }, { "x": 2709030.1973244147, "y": 434.0 }, { "x": 2719063.638795987, "y": 435.0 }, { "x": 2729097.0802675593, "y": 436.0 }, { "x": 2739130.5217391304, "y": 438.0 }, { "x": 2749163.9632107024, "y": 439.0 }, { "x": 2759197.4046822744, "y": 440.0 }, { "x": 2769230.8461538465, "y": 441.0 }, { "x": 2779264.287625418, "y": 442.0 }, { "x": 2789297.72909699, "y": 444.0 }, { "x": 2799331.1705685616, "y": 445.0 }, { "x": 2809364.6120401337, "y": 446.0 }, { "x": 2819398.0535117057, "y": 447.0 }, { "x": 2829431.4949832773, "y": 449.0 }, { "x": 2839464.93645485, "y": 450.0 }, { "x": 2849498.3779264214, "y": 451.0 }, { "x": 2859531.819397993, "y": 452.0 }, { "x": 2869565.260869565, "y": 454.0 }, { "x": 2879598.7023411375, "y": 455.0 }, { "x": 2889632.1438127086, "y": 456.0 }, { "x": 2899665.585284281, "y": 457.0 }, { "x": 2909699.026755853, "y": 458.0 }, { "x": 2919732.468227425, "y": 460.0 }, { "x": 2929765.9096989967, "y": 461.0 }, { "x": 2939799.3511705687, "y": 462.0 }, { "x": 2949832.7926421408, "y": 463.0 }, { "x": 2959866.2341137123, "y": 465.0 }, { "x": 2969899.6755852844, "y": 466.0 }, { "x": 2979933.1170568564, "y": 467.0 }, { "x": 2989966.558528428, "y": 468.0 }, { "x": 3000000.0, "y": 469.0 }] };
        data["datasets"].push(trendline)
      }

      const options = {
        responsive: true,
        title: {
          display: true,
          text: "Total Covid Cases v Total Covid Reports"
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label;
              return label + ': (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
            }
          }
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Total Covid Reports"
              }
            }
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Total Covid Cases"
              }
            }
          ]
        }
      }

      graph = <Scatter data={data} options={options} />

    } else if (this.state.dataSelected == "google_sheets") {
      if (this.state.graphType === "Scatter") {
        console.log("graphy type", this.state.graphType)
        const values = [];
        const labels = [];
        const backgroundColours = [];
        var xAxes_title = "News Reports";
        var yAxes_title = "Cumulative Covid-19 Cases";

        if (this.state.keys.length === 3) {
          // eslint-disable-next-line array-callback-return
          this.state.data.map(obj => {
            var x = obj["X-Axis"].replace(/,/g, "");
            var y = obj["Y-Axis"].replace(/,/g, "");
            var json = { x: parseInt(x), y: parseInt(y) };
            values.push(json);
            labels.push(obj["Plot Label"])
          });
          console.log("3");
          xAxes_title = this.state.keys[1];
          yAxes_title = this.state.keys[2];

        } else if (this.state.keys.length === 2) {
          console.log("2")
          this.state.data.map(obj => {
            var country = obj[this.state.keys[0]];
            var jsonAPI = matchUp(country);
            console.log("json", jsonAPI);
            if (Object.keys(jsonAPI).length > 0) {
              var x = jsonAPI["TotalConfirmed"].replace(/,/g, "");
              var y = obj["Y-Axis"].replace(/,/g, "");

              values.push({ x: parseInt(x), y: parseInt(y) });
              labels.push(obj["Plot Label"])
            }
          });

          xAxes_title = "Cumulative Covid-19 Cases";
          yAxes_title = this.state.keys[1];

        } else {
          console.log("1");

        }

        for (var k in values) {
          var r = Math.floor(Math.random() * 255);
          var g = Math.floor(Math.random() * 255);
          var b = Math.floor(Math.random() * 255);
          var colour = "rgb(" + r + "," + g + "," + b + ")";
          backgroundColours.push(colour);
        }



        // Graph data info
        const scatterData = {
          labels: labels,
          datasets: [{
            label: "Countries",
            data: values,
            pointRadius: 8,
            pointHoverRadius: 11,
            backgroundColor: backgroundColours
          }],
        };


        console.log("sc", scatterData)
        console.log("ac", values.length)
        console.log("scc", labels.length)
        console.log("scc", backgroundColours.length)

        //Graph options info
        const options = {
          responsive: true,
          title: {
            display: true,
            text: xAxes_title + ' v ' + yAxes_title
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                var label = data.labels[tooltipItem.index];
                return label + ': (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
              }
            }
          },
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: yAxes_title
                }
              }
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: xAxes_title
                }
              }
            ]
          }
        }

        graph = <Scatter data={scatterData} options={options} />
      } else if (this.state.graphType === "Bar") {
        const values = [];
        const labels = [];
        const backgroundColours = [];
        const hoverBackgroundColor = [];
        const xAxes = this.state.keys[0];
        const yAxes = this.state.keys[1];
        const title = this.state.keys[2];
        //data and labels
        this.state.data.map(obj => {
          var val = obj["Y-Axis"].replace(/,/g, "");
          values.push(parseInt(val));
          labels.push(obj["X-Axis"])
        });

        //graph colours
        for (var k in values) {
          var r3 = Math.floor(Math.random() * 255);
          var g3 = Math.floor(Math.random() * 255);
          var b3 = Math.floor(Math.random() * 255);
          var colour3 = "rgb(" + r3 + "," + g3 + "," + b3 + ")";
          backgroundColours.push(colour3);
          hoverBackgroundColor.push("rgb(" + r3 + "," + g3 + "," + b3 + ", 0.7)");
        }

        const state = {
          labels: labels,
          datasets: [
            {
              label: yAxes,
              backgroundColor: backgroundColours,
              borderColor: 'rgba(0,0,0,0.5)',
              hoverBackgroundColor: hoverBackgroundColor,
              borderWidth: 1,
              data: values
            }
          ]
        }

        const options = {
          title: {
            display: true,
            text: title,
            fontSize: 20
          },
          legend: {
            display: true,
            position: 'right'
          },
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: yAxes
                }
              }
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: xAxes
                }
              }
            ]
          }
        }
        graph = <Bar data={state} options={options} />
      } else if (this.state.graphType === "Line") {
        analysis = (
          <div>
            <p>Model r^2 score:0.9963508545044002</p>
            <p>Pearsons correlation and p-value: (0.9182105980477931, 2.0522037834387432e-140)</p>
            <p>Spearmans correlation and p-value: SpearmanrResult(correlation=0.9997287989787041, pvalue=0.0)</p>
            <p>Kendalls correlation and p-value: KendalltauResult(correlation=0.9965509759668228, pvalue=2.052367473265342e-167)</p>
            <p>Prediction for 01/07/2020 is 664858 total cases</p>
          </div>
        )


        const values = [];
        const labels = [];
        const xAxes = this.state.keys[0];
        const yAxes = this.state.keys[1];
        const title = this.state.keys[2];

        //data and labels
        this.state.data.map(obj => {
          var val = obj["Y-Axis"].replace(/,/g, "");
          values.push(parseInt(val));
          labels.push(obj["X-Axis"])
        });

        const state = {
          labels: labels,
          datasets: [
            {
              label: yAxes,
              fill: false,
              lineTension: 0.,
              backgroundColor: 'rgba(75,192,200,1)',
              borderColor: 'rgba(75,192,200,0.3)',
              hoverBackgroundColor: 'rgba(173, 178, 179, 1)',
              borderWidth: 0,
              pointRadius: 1,
              pointHoverRadius: 2,
              data: values
            }
          ]
        }

        if (this.state.showTrendline) {
          state.datasets.push({
            label: "Exponential Trendline",
            pointRadius: 0,
            showLine: true,
            fill: false,
            borderColor: 'rgba(240,40,40,0.3)',
            data: [{ "x": 1.0, "y": -6936.0 }, { "x": 2.0, "y": -6896.0 }, { "x": 3.0, "y": -6855.0 }, { "x": 4.0, "y": -6813.0 }, { "x": 5.0, "y": -6768.0 }, { "x": 6.0, "y": -6722.0 }, { "x": 7.0, "y": -6673.0 }, { "x": 8.0, "y": -6623.0 }, { "x": 9.0, "y": -6570.0 }, { "x": 10.0, "y": -6516.0 }, { "x": 11.0, "y": -6458.0 }, { "x": 12.0, "y": -6399.0 }, { "x": 13.0, "y": -6337.0 }, { "x": 14.0, "y": -6273.0 }, { "x": 15.0, "y": -6205.0 }, { "x": 16.0, "y": -6135.0 }, { "x": 17.0, "y": -6062.0 }, { "x": 18.0, "y": -5986.0 }, { "x": 19.0, "y": -5907.0 }, { "x": 20.0, "y": -5825.0 }, { "x": 21.0, "y": -5739.0 }, { "x": 22.0, "y": -5649.0 }, { "x": 23.0, "y": -5556.0 }, { "x": 24.0, "y": -5458.0 }, { "x": 25.0, "y": -5357.0 }, { "x": 26.0, "y": -5251.0 }, { "x": 27.0, "y": -5141.0 }, { "x": 28.0, "y": -5027.0 }, { "x": 29.0, "y": -4907.0 }, { "x": 30.0, "y": -4783.0 }, { "x": 31.0, "y": -4653.0 }, { "x": 32.0, "y": -4518.0 }, { "x": 33.0, "y": -4377.0 }, { "x": 34.0, "y": -4230.0 }, { "x": 35.0, "y": -4077.0 }, { "x": 36.0, "y": -3918.0 }, { "x": 37.0, "y": -3752.0 }, { "x": 38.0, "y": -3579.0 }, { "x": 39.0, "y": -3399.0 }, { "x": 40.0, "y": -3211.0 }, { "x": 41.0, "y": -3016.0 }, { "x": 42.0, "y": -2812.0 }, { "x": 43.0, "y": -2599.0 }, { "x": 44.0, "y": -2378.0 }, { "x": 45.0, "y": -2148.0 }, { "x": 46.0, "y": -1907.0 }, { "x": 47.0, "y": -1657.0 }, { "x": 48.0, "y": -1396.0 }, { "x": 49.0, "y": -1125.0 }, { "x": 50.0, "y": -841.0 }, { "x": 51.0, "y": -546.0 }, { "x": 52.0, "y": -239.0 }, { "x": 53.0, "y": 81.0 }, { "x": 54.0, "y": 415.0 }, { "x": 55.0, "y": 763.0 }, { "x": 56.0, "y": 1125.0 }, { "x": 57.0, "y": 1502.0 }, { "x": 58.0, "y": 1896.0 }, { "x": 59.0, "y": 2306.0 }, { "x": 60.0, "y": 2733.0 }, { "x": 61.0, "y": 3178.0 }, { "x": 62.0, "y": 3641.0 }, { "x": 63.0, "y": 4124.0 }, { "x": 64.0, "y": 4627.0 }, { "x": 65.0, "y": 5152.0 }, { "x": 66.0, "y": 5698.0 }, { "x": 67.0, "y": 6267.0 }, { "x": 68.0, "y": 6861.0 }, { "x": 69.0, "y": 7479.0 }, { "x": 70.0, "y": 8123.0 }, { "x": 71.0, "y": 8794.0 }, { "x": 72.0, "y": 9493.0 }, { "x": 73.0, "y": 10221.0 }, { "x": 74.0, "y": 10980.0 }, { "x": 75.0, "y": 11771.0 }, { "x": 76.0, "y": 12595.0 }, { "x": 77.0, "y": 13454.0 }, { "x": 78.0, "y": 14348.0 }, { "x": 79.0, "y": 15280.0 }, { "x": 80.0, "y": 16252.0 }, { "x": 81.0, "y": 17264.0 }, { "x": 82.0, "y": 18318.0 }, { "x": 83.0, "y": 19417.0 }, { "x": 84.0, "y": 20561.0 }, { "x": 85.0, "y": 21754.0 }, { "x": 86.0, "y": 22997.0 }, { "x": 87.0, "y": 24291.0 }, { "x": 88.0, "y": 25641.0 }, { "x": 89.0, "y": 27046.0 }, { "x": 90.0, "y": 28511.0 }, { "x": 91.0, "y": 30037.0 }, { "x": 92.0, "y": 31627.0 }, { "x": 93.0, "y": 33284.0 }, { "x": 94.0, "y": 35010.0 }, { "x": 95.0, "y": 36809.0 }, { "x": 96.0, "y": 38683.0 }, { "x": 97.0, "y": 40636.0 }, { "x": 98.0, "y": 42671.0 }, { "x": 99.0, "y": 44791.0 }, { "x": 100.0, "y": 47000.0 }, { "x": 101.0, "y": 49301.0 }, { "x": 102.0, "y": 51700.0 }, { "x": 103.0, "y": 54198.0 }, { "x": 104.0, "y": 56802.0 }, { "x": 105.0, "y": 59514.0 }, { "x": 106.0, "y": 62341.0 }, { "x": 107.0, "y": 65286.0 }, { "x": 108.0, "y": 68355.0 }, { "x": 109.0, "y": 71552.0 }, { "x": 110.0, "y": 74883.0 }, { "x": 111.0, "y": 78354.0 }, { "x": 112.0, "y": 81971.0 }, { "x": 113.0, "y": 85739.0 }, { "x": 114.0, "y": 89666.0 }, { "x": 115.0, "y": 93757.0 }, { "x": 116.0, "y": 98020.0 }, { "x": 117.0, "y": 102461.0 }, { "x": 118.0, "y": 107089.0 }, { "x": 119.0, "y": 111911.0 }, { "x": 120.0, "y": 116935.0 }, { "x": 121.0, "y": 122170.0 }, { "x": 122.0, "y": 127624.0 }, { "x": 123.0, "y": 133307.0 }, { "x": 124.0, "y": 139229.0 }, { "x": 125.0, "y": 145399.0 }, { "x": 126.0, "y": 151827.0 }, { "x": 127.0, "y": 158526.0 }, { "x": 128.0, "y": 165505.0 }, { "x": 129.0, "y": 172777.0 }, { "x": 130.0, "y": 180354.0 }, { "x": 131.0, "y": 188249.0 }, { "x": 132.0, "y": 196475.0 }, { "x": 133.0, "y": 205046.0 }, { "x": 134.0, "y": 213976.0 }, { "x": 135.0, "y": 223281.0 }, { "x": 136.0, "y": 232976.0 }, { "x": 137.0, "y": 243078.0 }, { "x": 138.0, "y": 253604.0 }, { "x": 139.0, "y": 264571.0 }, { "x": 140.0, "y": 275998.0 }, { "x": 141.0, "y": 287904.0 }, { "x": 142.0, "y": 300310.0 }, { "x": 143.0, "y": 313236.0 }, { "x": 144.0, "y": 326704.0 }, { "x": 145.0, "y": 340737.0 }, { "x": 146.0, "y": 355359.0 }, { "x": 147.0, "y": 370594.0 }, { "x": 148.0, "y": 386468.0 }, { "x": 149.0, "y": 403008.0 }, { "x": 150.0, "y": 420241.0 }, { "x": 151.0, "y": 438197.0 }, { "x": 152.0, "y": 456907.0 }, { "x": 153.0, "y": 476401.0 }, { "x": 154.0, "y": 496712.0 }, { "x": 155.0, "y": 517876.0 }, { "x": 156.0, "y": 539927.0 }, { "x": 157.0, "y": 562904.0 }, { "x": 158.0, "y": 586843.0 }, { "x": 159.0, "y": 611787.0 }, { "x": 160.0, "y": 637778.0 }, { "x": 161.0, "y": 664858.0 }]
          })
        }

        const options = {
          title: {
            display: true,
            text: title,
            fontSize: 20
          },
          legend: {
            display: true,
            position: 'right'
          },
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: yAxes
                }
              }
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: xAxes,
                  max: 161
                }
              }
            ]
          }
        }
        graph = <Line
          data={state}
          options={options}
        />

      } else if (this.state.graphType === "Pie") {
        console.log("a", this.state.keys)
        console.log("b", this.state.data)

        const values = [];
        const labels = [];
        const backgroundColours = [];
        const hoverBackgroundColor = [];
        const xAxes = this.state.keys[0];
        const yAxes = this.state.keys[1];

        //data and labels
        this.state.data.map(obj => {
          var val = obj["Value"].replace(/,/g, "");
          values.push(parseInt(val));
          labels.push(obj["Segment Label"])
        });

        //graph colours
        for (var k in values) {
          var r3 = Math.floor(Math.random() * 255);
          var g3 = Math.floor(Math.random() * 255);
          var b3 = Math.floor(Math.random() * 255);
          var colour3 = "rgb(" + r3 + "," + g3 + "," + b3 + ")";
          backgroundColours.push(colour3);
          hoverBackgroundColor.push("rgb(" + r3 + "," + g3 + "," + b3 + ", 0.7)");
        }

        // graph dataset
        const state = {
          labels: labels,
          datasets: [
            {
              label: xAxes,
              backgroundColor: backgroundColours,
              hoverBackgroundColor: hoverBackgroundColor,
              data: values
            }
          ]
        }

        //graph options
        const options = {
          title: {
            display: true,
            text: xAxes + ' v ' + yAxes,
            fontSize: 15
          },
          legend: {
            display: true,
            position: 'right'
          },
          maintainAspectRatio: false
        }

        graph = <Pie data={state} options={options} />
      }
    } else if (this.state.dataSelected == "covid_country_data") {
      graph = (<div className="covid_country_data_input_box">
        <input placeholder="Country" type="text" />
        <div>
          <p>Start Date:</p>
          <input type="date" />
        </div>
        <div>
          <p>End Date:</p>
          <input type="date" />
        </div>
        <div>
          <p>Prediction Date:</p>
          <input type="date" />
        </div>
        <button onClick={this.handleCovidCountrySearch}><i class="fa fa-search"></i>Search</button>
      </div>)
    } else if (this.state.dataSelected == "covid_panama_data") {
      analysis = (
        <div>
          <p>Model r^2 score: 0.999384812068609</p>
          <p>Pearsons correlation and p-value: (0.9505474542824731, 9.175027973191379e-177)</p>
          <p>Spearmans correlation and p-value: SpearmanrResult(correlation=0.998664435395668, pvalue=0.0)</p>
          <p>Kendalls correlation and p-value: KendalltauResult(correlation=0.9904714839794022, pvalue=9.113600210464224e-164)</p>
          <p>Prediction for 11/01/2021 is 306505 total cases</p>
        </div>
      )

      var data = { "datasets": [{ "label": "Panama Covid Cases", "backgroundColor": "rgb(130,57,53)", "pointRadius": 2, "data": [{ "x": 0, "y": 0 }, { "x": 1, "y": 0 }, { "x": 2, "y": 0 }, { "x": 3, "y": 0 }, { "x": 4, "y": 0 }, { "x": 5, "y": 0 }, { "x": 6, "y": 0 }, { "x": 7, "y": 0 }, { "x": 8, "y": 0 }, { "x": 9, "y": 0 }, { "x": 10, "y": 0 }, { "x": 11, "y": 0 }, { "x": 12, "y": 0 }, { "x": 13, "y": 0 }, { "x": 14, "y": 0 }, { "x": 15, "y": 0 }, { "x": 16, "y": 0 }, { "x": 17, "y": 0 }, { "x": 18, "y": 0 }, { "x": 19, "y": 0 }, { "x": 20, "y": 0 }, { "x": 21, "y": 0 }, { "x": 22, "y": 0 }, { "x": 23, "y": 0 }, { "x": 24, "y": 0 }, { "x": 25, "y": 0 }, { "x": 26, "y": 0 }, { "x": 27, "y": 0 }, { "x": 28, "y": 0 }, { "x": 29, "y": 0 }, { "x": 30, "y": 0 }, { "x": 31, "y": 0 }, { "x": 32, "y": 0 }, { "x": 33, "y": 0 }, { "x": 34, "y": 0 }, { "x": 35, "y": 0 }, { "x": 36, "y": 0 }, { "x": 37, "y": 0 }, { "x": 38, "y": 0 }, { "x": 39, "y": 0 }, { "x": 40, "y": 0 }, { "x": 41, "y": 0 }, { "x": 42, "y": 0 }, { "x": 43, "y": 0 }, { "x": 44, "y": 0 }, { "x": 45, "y": 0 }, { "x": 46, "y": 0 }, { "x": 47, "y": 0 }, { "x": 48, "y": 1 }, { "x": 49, "y": 8 }, { "x": 50, "y": 11 }, { "x": 51, "y": 27 }, { "x": 52, "y": 36 }, { "x": 53, "y": 43 }, { "x": 54, "y": 55 }, { "x": 55, "y": 69 }, { "x": 56, "y": 86 }, { "x": 57, "y": 109 }, { "x": 58, "y": 137 }, { "x": 59, "y": 200 }, { "x": 60, "y": 313 }, { "x": 61, "y": 345 }, { "x": 62, "y": 345 }, { "x": 63, "y": 443 }, { "x": 64, "y": 558 }, { "x": 65, "y": 674 }, { "x": 66, "y": 786 }, { "x": 67, "y": 901 }, { "x": 68, "y": 989 }, { "x": 69, "y": 1181 }, { "x": 70, "y": 1181 }, { "x": 71, "y": 1317 }, { "x": 72, "y": 1475 }, { "x": 73, "y": 1673 }, { "x": 74, "y": 1801 }, { "x": 75, "y": 1988 }, { "x": 76, "y": 2100 }, { "x": 77, "y": 2249 }, { "x": 78, "y": 2528 }, { "x": 79, "y": 2752 }, { "x": 80, "y": 2974 }, { "x": 81, "y": 3234 }, { "x": 82, "y": 3400 }, { "x": 83, "y": 3472 }, { "x": 84, "y": 3574 }, { "x": 85, "y": 3751 }, { "x": 86, "y": 4016 }, { "x": 87, "y": 4210 }, { "x": 88, "y": 4273 }, { "x": 89, "y": 4467 }, { "x": 90, "y": 4658 }, { "x": 91, "y": 4821 }, { "x": 92, "y": 5166 }, { "x": 93, "y": 5338 }, { "x": 94, "y": 5538 }, { "x": 95, "y": 5779 }, { "x": 96, "y": 6021 }, { "x": 97, "y": 6021 }, { "x": 98, "y": 6378 }, { "x": 99, "y": 6532 }, { "x": 100, "y": 6720 }, { "x": 101, "y": 7090 }, { "x": 102, "y": 7090 }, { "x": 103, "y": 7197 }, { "x": 104, "y": 7523 }, { "x": 105, "y": 7731 }, { "x": 106, "y": 7868 }, { "x": 107, "y": 8070 }, { "x": 108, "y": 8282 }, { "x": 109, "y": 8448 }, { "x": 110, "y": 8616 }, { "x": 111, "y": 8783 }, { "x": 112, "y": 8944 }, { "x": 113, "y": 9118 }, { "x": 114, "y": 9268 }, { "x": 115, "y": 9449 }, { "x": 116, "y": 9606 }, { "x": 117, "y": 9726 }, { "x": 118, "y": 9867 }, { "x": 119, "y": 9977 }, { "x": 120, "y": 10116 }, { "x": 121, "y": 10267 }, { "x": 122, "y": 10577 }, { "x": 123, "y": 10926 }, { "x": 124, "y": 11183 }, { "x": 125, "y": 11447 }, { "x": 126, "y": 11728 }, { "x": 127, "y": 12131 }, { "x": 128, "y": 12531 }, { "x": 129, "y": 13018 }, { "x": 130, "y": 13463 }, { "x": 131, "y": 13837 }, { "x": 132, "y": 14095 }, { "x": 133, "y": 14609 }, { "x": 134, "y": 15044 }, { "x": 135, "y": 15463 }, { "x": 136, "y": 16004 }, { "x": 137, "y": 16425 }, { "x": 138, "y": 16854 }, { "x": 139, "y": 17233 }, { "x": 140, "y": 17889 }, { "x": 141, "y": 18586 }, { "x": 142, "y": 19211 }, { "x": 143, "y": 20059 }, { "x": 144, "y": 21418 }, { "x": 145, "y": 21422 }, { "x": 146, "y": 21962 }, { "x": 147, "y": 22597 }, { "x": 148, "y": 23351 }, { "x": 149, "y": 24274 }, { "x": 150, "y": 25222 }, { "x": 151, "y": 26030 }, { "x": 152, "y": 26752 }, { "x": 153, "y": 27314 }, { "x": 154, "y": 28030 }, { "x": 155, "y": 29037 }, { "x": 156, "y": 29905 }, { "x": 157, "y": 30658 }, { "x": 158, "y": 31686 }, { "x": 159, "y": 32785 }, { "x": 160, "y": 33550 }, { "x": 161, "y": 34463 }, { "x": 162, "y": 35237 }, { "x": 163, "y": 35995 }, { "x": 164, "y": 36983 }, { "x": 165, "y": 38149 }, { "x": 166, "y": 39334 }, { "x": 167, "y": 40291 }, { "x": 168, "y": 41251 }, { "x": 169, "y": 42216 }, { "x": 170, "y": 43257 }, { "x": 171, "y": 44332 }, { "x": 172, "y": 45633 }, { "x": 173, "y": 47173 }, { "x": 174, "y": 48096 }, { "x": 175, "y": 49243 }, { "x": 176, "y": 50373 }, { "x": 177, "y": 51408 }, { "x": 178, "y": 52261 }, { "x": 179, "y": 53468 }, { "x": 180, "y": 54426 }, { "x": 181, "y": 55153 }, { "x": 182, "y": 55906 }, { "x": 183, "y": 56817 }, { "x": 184, "y": 57993 }, { "x": 185, "y": 58864 }, { "x": 186, "y": 60296 }, { "x": 187, "y": 61442 }, { "x": 188, "y": 62223 }, { "x": 189, "y": 63269 }, { "x": 190, "y": 64191 }, { "x": 191, "y": 65256 }, { "x": 192, "y": 66383 }, { "x": 193, "y": 67453 }, { "x": 194, "y": 68456 }, { "x": 195, "y": 69424 }, { "x": 196, "y": 70231 }, { "x": 197, "y": 71418 }, { "x": 198, "y": 72560 }, { "x": 199, "y": 73651 }, { "x": 200, "y": 74492 }, { "x": 201, "y": 75394 }, { "x": 202, "y": 76464 }, { "x": 203, "y": 77377 }, { "x": 204, "y": 78446 }, { "x": 205, "y": 79402 }, { "x": 206, "y": 80665 }, { "x": 207, "y": 81940 }, { "x": 208, "y": 82543 }, { "x": 209, "y": 82790 }, { "x": 210, "y": 83754 }, { "x": 211, "y": 83855 }, { "x": 212, "y": 84392 }, { "x": 213, "y": 85480 }, { "x": 214, "y": 86900 }, { "x": 215, "y": 87485 }, { "x": 216, "y": 88381 }, { "x": 217, "y": 89082 }, { "x": 218, "y": 89982 }, { "x": 219, "y": 90624 }, { "x": 220, "y": 91337 }, { "x": 221, "y": 92065 }, { "x": 222, "y": 92982 }, { "x": 223, "y": 93552 }, { "x": 224, "y": 94084 }, { "x": 225, "y": 94914 }, { "x": 226, "y": 95596 }, { "x": 227, "y": 96305 }, { "x": 228, "y": 97043 }, { "x": 229, "y": 97578 }, { "x": 230, "y": 98407 }, { "x": 231, "y": 99042 }, { "x": 232, "y": 99715 }, { "x": 233, "y": 100330 }, { "x": 234, "y": 101041 }, { "x": 235, "y": 101745 }, { "x": 236, "y": 102204 }, { "x": 237, "y": 102832 }, { "x": 238, "y": 103466 }, { "x": 239, "y": 104138 }, { "x": 240, "y": 104879 }, { "x": 241, "y": 105601 }, { "x": 242, "y": 106203 }, { "x": 243, "y": 106810 }, { "x": 244, "y": 107284 }, { "x": 245, "y": 107990 }, { "x": 246, "y": 108726 }, { "x": 247, "y": 109431 }, { "x": 248, "y": 110108 }, { "x": 249, "y": 110555 }, { "x": 250, "y": 111277 }, { "x": 251, "y": 111853 }, { "x": 252, "y": 112595 }, { "x": 253, "y": 113342 }, { "x": 254, "y": 113962 }, { "x": 255, "y": 114653 }, { "x": 256, "y": 115286 }, { "x": 257, "y": 115919 }, { "x": 258, "y": 116602 }, { "x": 259, "y": 117300 }, { "x": 260, "y": 118054 }, { "x": 261, "y": 118841 }, { "x": 262, "y": 119666 }, { "x": 263, "y": 120313 }, { "x": 264, "y": 120802 }, { "x": 265, "y": 121296 }, { "x": 266, "y": 122128 }, { "x": 267, "y": 122883 }, { "x": 268, "y": 123498 }, { "x": 269, "y": 124107 }, { "x": 270, "y": 124745 }, { "x": 271, "y": 125181 }, { "x": 272, "y": 125739 }, { "x": 273, "y": 126435 }, { "x": 274, "y": 127227 }, { "x": 275, "y": 127866 }, { "x": 276, "y": 128515 }, { "x": 277, "y": 129200 }, { "x": 278, "y": 129751 }, { "x": 279, "y": 130422 }, { "x": 280, "y": 131247 }, { "x": 281, "y": 132045 }, { "x": 282, "y": 132867 }, { "x": 283, "y": 133598 }, { "x": 284, "y": 134336 }, { "x": 285, "y": 134915 }, { "x": 286, "y": 135592 }, { "x": 287, "y": 136024 }, { "x": 288, "y": 136567 }, { "x": 289, "y": 137760 }, { "x": 290, "y": 138506 }, { "x": 291, "y": 139527 }, { "x": 292, "y": 140331 }, { "x": 293, "y": 141302 }, { "x": 294, "y": 142465 }, { "x": 295, "y": 143352 }, { "x": 296, "y": 144477 }, { "x": 297, "y": 145309 }, { "x": 298, "y": 146653 }, { "x": 299, "y": 147667 }, { "x": 300, "y": 148721 }, { "x": 301, "y": 149833 }, { "x": 302, "y": 151089 }, { "x": 303, "y": 152289 }, { "x": 304, "y": 153577 }, { "x": 305, "y": 154783 }, { "x": 306, "y": 155658 }, { "x": 307, "y": 156930 }, { "x": 308, "y": 158532 }, { "x": 309, "y": 160287 }, { "x": 310, "y": 161744 }, { "x": 311, "y": 163453 }, { "x": 312, "y": 164729 }, { "x": 313, "y": 165806 }, { "x": 314, "y": 167311 }, { "x": 315, "y": 169339 }, { "x": 316, "y": 171219 }, { "x": 317, "y": 173607 }, { "x": 318, "y": 175907 }, { "x": 319, "y": 177719 }, { "x": 320, "y": 179230 }, { "x": 321, "y": 181166 }, { "x": 322, "y": 182977 }, { "x": 323, "y": 185424 }, { "x": 324, "y": 187779 }, { "x": 325, "y": 190585 }, { "x": 326, "y": 193007 }, { "x": 327, "y": 194619 }, { "x": 328, "y": 196987 }, { "x": 329, "y": 199947 }, { "x": 330, "y": 203295 }, { "x": 331, "y": 206310 }, { "x": 332, "y": 209584 }, { "x": 333, "y": 212339 }, { "x": 334, "y": 214038 }, { "x": 335, "y": 217202 }, { "x": 336, "y": 220261 }, { "x": 337, "y": 223674 }, { "x": 338, "y": 226660 }, { "x": 339, "y": 228724 }, { "x": 340, "y": 231357 }, { "x": 341, "y": 233705 }, { "x": 342, "y": 238279 }, { "x": 343, "y": 242744 }, { "x": 344, "y": 246790 }, { "x": 345, "y": 249733 }] }] };

      if (this.state.showTrendline) {
        var trendline = { "label": "Trendline", "pointRadius": 0, "fill": false, "showLine": true, "borderColor": "rgba(60,57,200, 0.5)", "data": [{ "x": 1.0, "y": -1171.0 }, { "x": 2.0, "y": -1068.0 }, { "x": 3.0, "y": -966.0 }, { "x": 4.0, "y": -866.0 }, { "x": 5.0, "y": -768.0 }, { "x": 6.0, "y": -671.0 }, { "x": 7.0, "y": -576.0 }, { "x": 8.0, "y": -483.0 }, { "x": 9.0, "y": -393.0 }, { "x": 10.0, "y": -305.0 }, { "x": 11.0, "y": -220.0 }, { "x": 12.0, "y": -137.0 }, { "x": 13.0, "y": -58.0 }, { "x": 14.0, "y": 19.0 }, { "x": 15.0, "y": 93.0 }, { "x": 16.0, "y": 163.0 }, { "x": 17.0, "y": 231.0 }, { "x": 18.0, "y": 295.0 }, { "x": 19.0, "y": 356.0 }, { "x": 20.0, "y": 413.0 }, { "x": 21.0, "y": 467.0 }, { "x": 22.0, "y": 518.0 }, { "x": 23.0, "y": 566.0 }, { "x": 24.0, "y": 611.0 }, { "x": 25.0, "y": 652.0 }, { "x": 26.0, "y": 690.0 }, { "x": 27.0, "y": 724.0 }, { "x": 28.0, "y": 756.0 }, { "x": 29.0, "y": 784.0 }, { "x": 30.0, "y": 810.0 }, { "x": 31.0, "y": 832.0 }, { "x": 32.0, "y": 852.0 }, { "x": 33.0, "y": 869.0 }, { "x": 34.0, "y": 883.0 }, { "x": 35.0, "y": 895.0 }, { "x": 36.0, "y": 904.0 }, { "x": 37.0, "y": 911.0 }, { "x": 38.0, "y": 916.0 }, { "x": 39.0, "y": 919.0 }, { "x": 40.0, "y": 920.0 }, { "x": 41.0, "y": 919.0 }, { "x": 42.0, "y": 916.0 }, { "x": 43.0, "y": 912.0 }, { "x": 44.0, "y": 906.0 }, { "x": 45.0, "y": 900.0 }, { "x": 46.0, "y": 892.0 }, { "x": 47.0, "y": 883.0 }, { "x": 48.0, "y": 874.0 }, { "x": 49.0, "y": 864.0 }, { "x": 50.0, "y": 854.0 }, { "x": 51.0, "y": 844.0 }, { "x": 52.0, "y": 834.0 }, { "x": 53.0, "y": 824.0 }, { "x": 54.0, "y": 815.0 }, { "x": 55.0, "y": 806.0 }, { "x": 56.0, "y": 798.0 }, { "x": 57.0, "y": 791.0 }, { "x": 58.0, "y": 785.0 }, { "x": 59.0, "y": 781.0 }, { "x": 60.0, "y": 778.0 }, { "x": 61.0, "y": 777.0 }, { "x": 62.0, "y": 778.0 }, { "x": 63.0, "y": 781.0 }, { "x": 64.0, "y": 787.0 }, { "x": 65.0, "y": 796.0 }, { "x": 66.0, "y": 807.0 }, { "x": 67.0, "y": 821.0 }, { "x": 68.0, "y": 839.0 }, { "x": 69.0, "y": 859.0 }, { "x": 70.0, "y": 884.0 }, { "x": 71.0, "y": 913.0 }, { "x": 72.0, "y": 945.0 }, { "x": 73.0, "y": 982.0 }, { "x": 74.0, "y": 1023.0 }, { "x": 75.0, "y": 1069.0 }, { "x": 76.0, "y": 1120.0 }, { "x": 77.0, "y": 1176.0 }, { "x": 78.0, "y": 1237.0 }, { "x": 79.0, "y": 1304.0 }, { "x": 80.0, "y": 1376.0 }, { "x": 81.0, "y": 1454.0 }, { "x": 82.0, "y": 1538.0 }, { "x": 83.0, "y": 1628.0 }, { "x": 84.0, "y": 1725.0 }, { "x": 85.0, "y": 1828.0 }, { "x": 86.0, "y": 1938.0 }, { "x": 87.0, "y": 2055.0 }, { "x": 88.0, "y": 2179.0 }, { "x": 89.0, "y": 2310.0 }, { "x": 90.0, "y": 2449.0 }, { "x": 91.0, "y": 2595.0 }, { "x": 92.0, "y": 2749.0 }, { "x": 93.0, "y": 2911.0 }, { "x": 94.0, "y": 3081.0 }, { "x": 95.0, "y": 3259.0 }, { "x": 96.0, "y": 3445.0 }, { "x": 97.0, "y": 3640.0 }, { "x": 98.0, "y": 3843.0 }, { "x": 99.0, "y": 4056.0 }, { "x": 100.0, "y": 4277.0 }, { "x": 101.0, "y": 4507.0 }, { "x": 102.0, "y": 4746.0 }, { "x": 103.0, "y": 4994.0 }, { "x": 104.0, "y": 5252.0 }, { "x": 105.0, "y": 5519.0 }, { "x": 106.0, "y": 5796.0 }, { "x": 107.0, "y": 6082.0 }, { "x": 108.0, "y": 6378.0 }, { "x": 109.0, "y": 6684.0 }, { "x": 110.0, "y": 7000.0 }, { "x": 111.0, "y": 7326.0 }, { "x": 112.0, "y": 7662.0 }, { "x": 113.0, "y": 8008.0 }, { "x": 114.0, "y": 8364.0 }, { "x": 115.0, "y": 8730.0 }, { "x": 116.0, "y": 9107.0 }, { "x": 117.0, "y": 9494.0 }, { "x": 118.0, "y": 9891.0 }, { "x": 119.0, "y": 10299.0 }, { "x": 120.0, "y": 10717.0 }, { "x": 121.0, "y": 11146.0 }, { "x": 122.0, "y": 11585.0 }, { "x": 123.0, "y": 12034.0 }, { "x": 124.0, "y": 12495.0 }, { "x": 125.0, "y": 12965.0 }, { "x": 126.0, "y": 13447.0 }, { "x": 127.0, "y": 13938.0 }, { "x": 128.0, "y": 14441.0 }, { "x": 129.0, "y": 14953.0 }, { "x": 130.0, "y": 15477.0 }, { "x": 131.0, "y": 16010.0 }, { "x": 132.0, "y": 16554.0 }, { "x": 133.0, "y": 17109.0 }, { "x": 134.0, "y": 17674.0 }, { "x": 135.0, "y": 18249.0 }, { "x": 136.0, "y": 18834.0 }, { "x": 137.0, "y": 19430.0 }, { "x": 138.0, "y": 20035.0 }, { "x": 139.0, "y": 20651.0 }, { "x": 140.0, "y": 21277.0 }, { "x": 141.0, "y": 21912.0 }, { "x": 142.0, "y": 22558.0 }, { "x": 143.0, "y": 23213.0 }, { "x": 144.0, "y": 23878.0 }, { "x": 145.0, "y": 24552.0 }, { "x": 146.0, "y": 25236.0 }, { "x": 147.0, "y": 25929.0 }, { "x": 148.0, "y": 26631.0 }, { "x": 149.0, "y": 27343.0 }, { "x": 150.0, "y": 28063.0 }, { "x": 151.0, "y": 28792.0 }, { "x": 152.0, "y": 29530.0 }, { "x": 153.0, "y": 30276.0 }, { "x": 154.0, "y": 31031.0 }, { "x": 155.0, "y": 31794.0 }, { "x": 156.0, "y": 32566.0 }, { "x": 157.0, "y": 33345.0 }, { "x": 158.0, "y": 34132.0 }, { "x": 159.0, "y": 34927.0 }, { "x": 160.0, "y": 35729.0 }, { "x": 161.0, "y": 36539.0 }, { "x": 162.0, "y": 37355.0 }, { "x": 163.0, "y": 38179.0 }, { "x": 164.0, "y": 39010.0 }, { "x": 165.0, "y": 39847.0 }, { "x": 166.0, "y": 40690.0 }, { "x": 167.0, "y": 41540.0 }, { "x": 168.0, "y": 42396.0 }, { "x": 169.0, "y": 43257.0 }, { "x": 170.0, "y": 44125.0 }, { "x": 171.0, "y": 44997.0 }, { "x": 172.0, "y": 45875.0 }, { "x": 173.0, "y": 46758.0 }, { "x": 174.0, "y": 47646.0 }, { "x": 175.0, "y": 48538.0 }, { "x": 176.0, "y": 49435.0 }, { "x": 177.0, "y": 50335.0 }, { "x": 178.0, "y": 51240.0 }, { "x": 179.0, "y": 52149.0 }, { "x": 180.0, "y": 53060.0 }, { "x": 181.0, "y": 53976.0 }, { "x": 182.0, "y": 54894.0 }, { "x": 183.0, "y": 55815.0 }, { "x": 184.0, "y": 56738.0 }, { "x": 185.0, "y": 57664.0 }, { "x": 186.0, "y": 58592.0 }, { "x": 187.0, "y": 59522.0 }, { "x": 188.0, "y": 60453.0 }, { "x": 189.0, "y": 61386.0 }, { "x": 190.0, "y": 62320.0 }, { "x": 191.0, "y": 63255.0 }, { "x": 192.0, "y": 64190.0 }, { "x": 193.0, "y": 65126.0 }, { "x": 194.0, "y": 66062.0 }, { "x": 195.0, "y": 66998.0 }, { "x": 196.0, "y": 67934.0 }, { "x": 197.0, "y": 68870.0 }, { "x": 198.0, "y": 69804.0 }, { "x": 199.0, "y": 70738.0 }, { "x": 200.0, "y": 71671.0 }, { "x": 201.0, "y": 72602.0 }, { "x": 202.0, "y": 73532.0 }, { "x": 203.0, "y": 74459.0 }, { "x": 204.0, "y": 75385.0 }, { "x": 205.0, "y": 76308.0 }, { "x": 206.0, "y": 77229.0 }, { "x": 207.0, "y": 78147.0 }, { "x": 208.0, "y": 79063.0 }, { "x": 209.0, "y": 79975.0 }, { "x": 210.0, "y": 80883.0 }, { "x": 211.0, "y": 81789.0 }, { "x": 212.0, "y": 82690.0 }, { "x": 213.0, "y": 83588.0 }, { "x": 214.0, "y": 84481.0 }, { "x": 215.0, "y": 85371.0 }, { "x": 216.0, "y": 86255.0 }, { "x": 217.0, "y": 87135.0 }, { "x": 218.0, "y": 88011.0 }, { "x": 219.0, "y": 88881.0 }, { "x": 220.0, "y": 89747.0 }, { "x": 221.0, "y": 90607.0 }, { "x": 222.0, "y": 91461.0 }, { "x": 223.0, "y": 92311.0 }, { "x": 224.0, "y": 93154.0 }, { "x": 225.0, "y": 93992.0 }, { "x": 226.0, "y": 94824.0 }, { "x": 227.0, "y": 95650.0 }, { "x": 228.0, "y": 96469.0 }, { "x": 229.0, "y": 97283.0 }, { "x": 230.0, "y": 98090.0 }, { "x": 231.0, "y": 98892.0 }, { "x": 232.0, "y": 99686.0 }, { "x": 233.0, "y": 100475.0 }, { "x": 234.0, "y": 101256.0 }, { "x": 235.0, "y": 102032.0 }, { "x": 236.0, "y": 102800.0 }, { "x": 237.0, "y": 103563.0 }, { "x": 238.0, "y": 104318.0 }, { "x": 239.0, "y": 105067.0 }, { "x": 240.0, "y": 105810.0 }, { "x": 241.0, "y": 106546.0 }, { "x": 242.0, "y": 107276.0 }, { "x": 243.0, "y": 107999.0 }, { "x": 244.0, "y": 108716.0 }, { "x": 245.0, "y": 109427.0 }, { "x": 246.0, "y": 110132.0 }, { "x": 247.0, "y": 110830.0 }, { "x": 248.0, "y": 111523.0 }, { "x": 249.0, "y": 112210.0 }, { "x": 250.0, "y": 112892.0 }, { "x": 251.0, "y": 113568.0 }, { "x": 252.0, "y": 114239.0 }, { "x": 253.0, "y": 114904.0 }, { "x": 254.0, "y": 115565.0 }, { "x": 255.0, "y": 116222.0 }, { "x": 256.0, "y": 116873.0 }, { "x": 257.0, "y": 117521.0 }, { "x": 258.0, "y": 118165.0 }, { "x": 259.0, "y": 118806.0 }, { "x": 260.0, "y": 119443.0 }, { "x": 261.0, "y": 120078.0 }, { "x": 262.0, "y": 120710.0 }, { "x": 263.0, "y": 121340.0 }, { "x": 264.0, "y": 121968.0 }, { "x": 265.0, "y": 122595.0 }, { "x": 266.0, "y": 123221.0 }, { "x": 267.0, "y": 123847.0 }, { "x": 268.0, "y": 124473.0 }, { "x": 269.0, "y": 125099.0 }, { "x": 270.0, "y": 125726.0 }, { "x": 271.0, "y": 126355.0 }, { "x": 272.0, "y": 126986.0 }, { "x": 273.0, "y": 127620.0 }, { "x": 274.0, "y": 128258.0 }, { "x": 275.0, "y": 128899.0 }, { "x": 276.0, "y": 129545.0 }, { "x": 277.0, "y": 130196.0 }, { "x": 278.0, "y": 130854.0 }, { "x": 279.0, "y": 131518.0 }, { "x": 280.0, "y": 132190.0 }, { "x": 281.0, "y": 132870.0 }, { "x": 282.0, "y": 133559.0 }, { "x": 283.0, "y": 134258.0 }, { "x": 284.0, "y": 134969.0 }, { "x": 285.0, "y": 135690.0 }, { "x": 286.0, "y": 136425.0 }, { "x": 287.0, "y": 137173.0 }, { "x": 288.0, "y": 137936.0 }, { "x": 289.0, "y": 138714.0 }, { "x": 290.0, "y": 139510.0 }, { "x": 291.0, "y": 140322.0 }, { "x": 292.0, "y": 141154.0 }, { "x": 293.0, "y": 142006.0 }, { "x": 294.0, "y": 142878.0 }, { "x": 295.0, "y": 143773.0 }, { "x": 296.0, "y": 144692.0 }, { "x": 297.0, "y": 145635.0 }, { "x": 298.0, "y": 146605.0 }, { "x": 299.0, "y": 147602.0 }, { "x": 300.0, "y": 148628.0 }, { "x": 301.0, "y": 149684.0 }, { "x": 302.0, "y": 150771.0 }, { "x": 303.0, "y": 151892.0 }, { "x": 304.0, "y": 153048.0 }, { "x": 305.0, "y": 154239.0 }, { "x": 306.0, "y": 155468.0 }, { "x": 307.0, "y": 156737.0 }, { "x": 308.0, "y": 158047.0 }, { "x": 309.0, "y": 159399.0 }, { "x": 310.0, "y": 160796.0 }, { "x": 311.0, "y": 162239.0 }, { "x": 312.0, "y": 163731.0 }, { "x": 313.0, "y": 165272.0 }, { "x": 314.0, "y": 166865.0 }, { "x": 315.0, "y": 168511.0 }, { "x": 316.0, "y": 170214.0 }, { "x": 317.0, "y": 171974.0 }, { "x": 318.0, "y": 173794.0 }, { "x": 319.0, "y": 175676.0 }, { "x": 320.0, "y": 177623.0 }, { "x": 321.0, "y": 179635.0 }, { "x": 322.0, "y": 181716.0 }, { "x": 323.0, "y": 183868.0 }, { "x": 324.0, "y": 186093.0 }, { "x": 325.0, "y": 188394.0 }, { "x": 326.0, "y": 190773.0 }, { "x": 327.0, "y": 193232.0 }, { "x": 328.0, "y": 195775.0 }, { "x": 329.0, "y": 198403.0 }, { "x": 330.0, "y": 201119.0 }, { "x": 331.0, "y": 203926.0 }, { "x": 332.0, "y": 206827.0 }, { "x": 333.0, "y": 209825.0 }, { "x": 334.0, "y": 212921.0 }, { "x": 335.0, "y": 216120.0 }, { "x": 336.0, "y": 219424.0 }, { "x": 337.0, "y": 222837.0 }, { "x": 338.0, "y": 226360.0 }, { "x": 339.0, "y": 229998.0 }, { "x": 340.0, "y": 233753.0 }, { "x": 341.0, "y": 237629.0 }, { "x": 342.0, "y": 241629.0 }, { "x": 343.0, "y": 245756.0 }, { "x": 344.0, "y": 250014.0 }, { "x": 345.0, "y": 254406.0 }, { "x": 346.0, "y": 258936.0 }, { "x": 347.0, "y": 263607.0 }, { "x": 348.0, "y": 268422.0 }, { "x": 349.0, "y": 273386.0 }, { "x": 350.0, "y": 278503.0 }, { "x": 351.0, "y": 283776.0 }, { "x": 352.0, "y": 289208.0 }, { "x": 353.0, "y": 294804.0 }, { "x": 354.0, "y": 300569.0 }, { "x": 355.0, "y": 306505.0 }] };
        data["datasets"].push(trendline)
      }

      const options = {
        responsive: true,
        title: {
          display: true,
          text: "Total Panama Covid Cases v Days"
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label;
              return label + ': (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
            }
          }
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Total Panama Covid Cases"
              }
            }
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Days"
              }
            }
          ]
        }
      }

      graph = <Scatter data={data} options={options} />
    } else if (this.state.dataSelected === "google_trends") {
      graph = <TrendGraphWrapper/>
      
    }

    var dataOptions = [
  { value: 'google_sheets', label: 'Google Sheets' },
  { value: 'promed_covid_data', label: 'Promed COVID-19 Data' },
  { value: 'google_trends', label: 'Google Trends' },
  { value: 'covid_country_data', label: 'COVID-19 Country Data' }
]

return (
  <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="horizontal">
    {/* FRONT OF CARD-- GRAPH */}
    <div className="regression-front" >
      <p><i class="fa fa-signal fa-fw"></i>Charts</p>
      <div className="filtersButton">
        <button onClick={this.onClickShowTrendline}><i class="fa fa-line-chart"></i></button>
      </div>

      <Select onChange={this.handleDataSelectChange} options={dataOptions} />

      <hr />
      <div id="mainGraphForSim" className="chart">
        {graph}
      </div>
      <button onClick={this.handleClick}>Click to view Analysis</button>

    </div>


    {/* BACK OF CARD-- ANALYSIS TEXT */}
    <div className="regression-back">
      <p><i class="fa fa-signal fa-fw"></i>Regression Analysis</p>
      <hr />
      <text id="regression-back">
        <div>
          {analysis}
        </div>
      </text>
      <button onClick={this.handleClick}>Click to view Graph</button>
    </div>
  </ReactCardFlip>
)
  }
}

export default RegressionCard;