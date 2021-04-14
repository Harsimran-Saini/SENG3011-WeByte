from scipy.optimize import minimize_scalar
from scipy.optimize import curve_fit
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv("ConfirmedCovidCases_India.csv")
y=df['Cases'].to_numpy()
x=df['days'].to_numpy()


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


fit = curve_fit(exp_fit,x[:260],y[:260],  p0 = [0.005, 0.03, 5])
fit_eq = fit[0][0]*np.exp(fit[0][1]*x[:260])+fit[0][2]

# #----PLOTTING-------
fig = plt.figure()
ax = fig.subplots()
ax.scatter(x[:260], y[:260], color = 'b', s = 5)
ax.plot(x[:260], fit_eq, color = 'r', alpha = 0.7)
ax.set_ylabel('Total cases')
ax.set_xlabel('N° of days')
plt.show()

# trend = np.polyfit(x, np.log(y), 1, w=np.sqrt(y))
# plt.plot(x,y)
# # trendpoly = np.poly1d(trend)
# # plt.plot(x,trendpoly(x))
# plt.show()
# exp = minimize_scalar(cost_function, bounds=(0.1, 10), method='bounded')

# print(exp.x)
#
# print(np.power(x, exp.x))
#
# days = np.power(y, exp.x)

# pd.DataFrame(y,days).to_csv("IndiaCurve")
# df = pd.read_csv("IndiaCurve")
#
# df.plot()
# plt.show()
