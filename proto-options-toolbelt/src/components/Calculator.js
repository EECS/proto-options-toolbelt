import React, { Component } from 'react';

class Calculator extends Component {
  constructor(props){
    super(props);

    this.state = {
      //input parameters
      ivPercentile: 0,
      maxProfit: 0,
      theoMaxLoss: 0,
      managedMaxLossFactor:1,
      bpr: 0,
      theta:0,
      pop:0,

      //webpage form states
      formChanged: false,
      analysisCompleted: false,
      initialLoad: true,

      //analysis results
      plMaximum: 0,
      plManaged: 0,
      kcMaxLoss: 0,
      kcManagedLoss: 0,
      thetaEfficiency: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange (event){
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]:value,
      formChanged: true,
      analysisCompleted: false
    });
  }

  handleSubmit(event){
    //this.setState({value: event.target.value});
    event.preventDefault();
    this.setState({
      formChanged: false,
      analysisCompleted: true,
      initialLoad: false
    });

    this.conductAnalysis();

  }

  conductAnalysis(){
    //probability of loss
    const pol = 100-this.state.pop;
    const managedLoss = this.state.managedMaxLossFactor*this.state.maxProfit;
    const ratioMaxPMaxL = this.state.maxProfit/this.state.theoMaxLoss;
    const ratioMaxPManagedL = this.state.maxProfit/managedLoss;

    const plMaximum =
      (this.state.pop*this.state.maxProfit-pol*this.state.theoMaxLoss)/100;
    const plManaged = 
      (this.state.pop*this.state.maxProfit-pol*managedLoss)/100;
    const kcMaxLoss = Math.round((((ratioMaxPMaxL*(this.state.pop/100)-(pol/100))/ratioMaxPMaxL)*100)*100)/100;
    const kcManagedLoss = Math.round((((ratioMaxPManagedL*(this.state.pop/100)-(pol/100))/ratioMaxPManagedL)*100)*100)/100;

    const thetaEfficiency = Math.round(((this.state.theta/this.state.bpr)*100)*10000)/10000;

    this.setState({
      plMaximum: plMaximum,
      plManaged: plManaged,
      kcMaxLoss: kcMaxLoss,
      kcManagedLoss: kcManagedLoss,
      thetaEfficiency: thetaEfficiency
    });
  }

  vertFlex ={
    display: "flex",
    flexDirection:"column",
    borderStyle:"solid",
  }

  render (){
    return (
    
      <div className="Calculator">
        <h1>
          Options Toolbelt Calculator
        </h1>
        <div style={this.vertFlex}>
          <p>
            IV Percentile: {this.state.ivPercentile}%
          </p>
          <p>
            Maximum Profit: ${this.state.maxProfit}
          </p>
          <p>
            Theoretical Max Loss: ${this.state.theoMaxLoss}
          </p>
          <p>
            Managed Max Loss: ${this.state.managedMaxLossFactor*this.state.maxProfit}
          </p>
          <p>
            Buying Power Reduction: ${this.state.bpr}
          </p>
          <p>
            Theta: {this.state.theta}
          </p>
          <p>
            Probability of Profit: {this.state.pop}%
          </p>
        </div>

        <form style={this.vertFlex} onSubmit={this.handleSubmit}>

          <label>
            IV Percentile:
            <input name="ivPercentile" onChange={this.handleChange} type="percent" required/>
          </label>

          <label>
            Max Profit:
            <input name="maxProfit" onChange={this.handleChange} type="float" required/>
          </label>

          <label>
            Theoretical Max Loss:
            <input name="theoMaxLoss" onChange={this.handleChange} type="float" required/>
          </label>

          <label>
            Managed Max Loss Factor:
            <input name="managedMaxLossFactor" onChange={this.handleChange} type="float" required/>
          </label>

          <label>
            Buying Power Reduction:
            <input name="bpr" onChange={this.handleChange} type="float" required/>
          </label>

          <label>
            Theta:
            <input name="theta" onChange={this.handleChange} type="float" required/>
          </label>

          <label>
            Probability of Profit:
            <input name="pop" onChange={this.handleChange} type="float" required/>
          </label>

          <input type="submit" value="Submit" />
        </form>

        <div>
          <h2>
            Analysis Results:
          </h2>
          {!this.state.analysisCompleted ? <h3>Submit position details to generate analysis</h3> : null}
            <p>
            P/L Analysis with Maximum Loss: ${this.state.analysisCompleted ? this.state.plMaximum: 0}
            </p>
            <p>
              P/L Analysis with Managed Loss: ${this.state.analysisCompleted ? this.state.plManaged : 0}
            </p>
            <p>
              Kelly Criterion assuming Maximum Loss: {this.state.analysisCompleted ? this.state.kcMaxLoss : 0}%
            </p>
            <p>
              Kelly Criterion assuming Managed Loss: {this.state.analysisCompleted ? this.state.kcManagedLoss : 0}%
            </p>
            <p>
              Theta Efficiency: {this.state.analysisCompleted ? this.state.thetaEfficiency: 0}%
            </p>

        </div>
      </div>
    );
  } 
}

export default Calculator;
