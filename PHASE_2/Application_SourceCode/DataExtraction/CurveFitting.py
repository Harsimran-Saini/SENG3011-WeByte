from scipy.optimize import minimize_scalar
from scipy.optimize import curve_fit
from sklearn.metrics import r2_score
import scipy
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import os
from extract_CSV_data import *

df = pd.read_csv("ConfirmedCovidCases_India.csv")
y=df['Cases'].to_numpy()
x=df['days'].to_numpy()
date=df['Date'].to_numpy()

#define cost function
def cost_function(e):

    #y and x are already defined
    r = np.corrcoef(y,x**e) #returns correlation matrix
    #print each iteration
    print('r value: {:0.4f} exp: {:.4f}'.format(r[0][1],e))
    return -abs(r[0][1])


def exp_fit(x, a, b, c):
    y = a*np.exp(b*x) + c
    return y

def indexDates(data):

    df = pd.read_csv(data)
    df.index.name = 'days'
    df.to_csv(data)
    return

def exponentialFit(x,y,upTo=None, prediction=None, generateJson=False):
    if prediction !=None:
        line = np.linspace(1,prediction,prediction)
    else:
        line = x

    if upTo == None:
        #fits the data to the data set
        fit = curve_fit(exp_fit,x[:],y[:],  p0 = [0.005, 0.03, 5])
        fit_eq_original = fit[0][0]*np.exp(fit[0][1]*x[:])+fit[0][2]

        #extends the curve based on line, which may contain a prediction
        fit_eq = fit[0][0]*np.exp(fit[0][1]*line[:])+fit[0][2]

        #----PRINT R SCORE------
        print(f"Model r^2 score: {r2_score(y, fit_eq_original)}")
        #----PRINT Coorelations-----
        getCorrelation(x, y)
        #----PLOTTING-------
        fig = plt.figure()
        ax = fig.subplots()
        ax.scatter(x, y, color = 'b', s = 5)
        ax.plot(line, fit_eq, color = 'r', alpha = 0.7)
        ax.set_ylabel('Total cases')
        ax.set_xlabel('N° of days')
        plt.show()

    else:
        fit = curve_fit(exp_fit,x[:upTo],y[:upTo],  p0 = [0.005, 0.03, 5])
        fit_eq_original = fit[0][0]*np.exp(fit[0][1]*x[:upTo])+fit[0][2]
        fit_eq = fit[0][0]*np.exp(fit[0][1]*line[:])+fit[0][2]

        #----PRINT R SCORE------
        print(f"Model r^2 score:{r2_score(y[:upTo], fit_eq_original)}")
        #----PRINT Coorelations-----
        getCorrelation(x, y)
        #----PLOTTING-------
        fig = plt.figure()
        ax = fig.subplots()
        ax.scatter(x[:upTo], y[:upTo], color = 'b', s = 5)
        ax.plot(line[:], fit_eq, color = 'r', alpha = 0.7)
        ax.set_ylabel('Total cases')
        ax.set_xlabel('N° of days')
        plt.show()

    predictArray = np.around(fit_eq)

    if generateJson == True:
        generateLineJson(line, predictArray)




    return



def polyfit(x,y,degree, prediction=None, generateJson=False):

    mymodel = np.poly1d(np.polyfit(x,y,degree))
    plt.scatter(x,y)


    if prediction == None:
        #default the line fit to size of the x axis
        myline = np.linspace(1, x[-1],x[-1])
    else:
        myline = np.linspace(1, prediction,prediction)

    if generateJson == True:

        predictArray=[]
        for i in myline:
            predictArray.append(round(mymodel(i)))
        # generateLineJson(myline, predictArray)

        generateLineJson(myline, predictArray)




    plt.plot(myline, mymodel(myline))
    print(f"Model r^2 score: {r2_score(y,mymodel(x))}")
    getCorrelation(x, y)
    plt.show()
    return

"""
If dataFile==None x and y must be numpy arrays
"""
def getCorrelation( x, y, dataFile=None,isCSV=True):

    if dataFile != None:
        if isCSV==True:
            df=pd.read_csv(dataFile)
        else:
            #if it isnt a csv file it is a DF object
            df=dataFile

        x=df[x].to_numpy()
        y=df[y].to_numpy()
        pearson=scipy.stats.pearsonr(x, y)
        spearman=scipy.stats.spearmanr(x, y)
        kendall=scipy.stats.kendalltau(x, y)
        print(f"Pearson's correlation and p-value: {pearson}")
        print(f"Spearman's correlation and p-value: {spearman}")
        print(f"Kendall's correlation and p-value: {kendall}")
        return
    else:
        pearson=scipy.stats.pearsonr(x, y)
        spearman=scipy.stats.spearmanr(x, y)
        kendall=scipy.stats.kendalltau(x, y)
        print(f"Pearson's correlation and p-value: {pearson}")
        print(f"Spearman's correlation and p-value: {spearman}")
        print(f"Kendall's correlation and p-value: {kendall}")
        return

def generateLineJson (x, y):


    data = {"x":x,"y":y}
    df= pd.DataFrame(data=data)
    df.to_csv("IndiaCurveFit.csv", index=False)
    extractData("IndiaCurveFit.csv")
    return
