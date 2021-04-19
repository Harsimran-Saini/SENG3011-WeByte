from pytrends.request import TrendReq
from datetime import date
from pycountry import countries

pytrends = TrendReq(hl='en-US', tz=360)

def get_trends(keyword, start_date, end_date, country=None):
    countryStr = '' # All countries
    if country != None:
        country = countries.search_fuzzy(country)
        if len(country) == 1:
            country = country[0]
            countryStr = country.alpha_2
        else:
            raise AttributeError(f"Invalid country: {country} is not recognised as a country or is too vague")
    
            
    kw_list = [keyword]
    dateStr = str(start_date) + " " + str(end_date)
    pytrends.build_payload(kw_list, timeframe=dateStr, geo=countryStr, gprop='')
    df = pytrends.interest_over_time()

    return df

def trends_by_country(keyword, start_date, end_date):
    kw_list = [keyword]
    dateStr = str(start_date) + " " + str(end_date)
    print(kw_list, dateStr)
    pytrends.build_payload(kw_list, timeframe=dateStr, geo='')
    df = pytrends.interest_by_region(resolution='COUNTRY', inc_low_vol=True, inc_geo_code=True)

    return df

if __name__ == "__main__":
    today = date.today()
    yearAgo = today.replace(year=today.year - 1)
    #df = get_trends("covid-19", yearAgo, today, "Australia")
    #df.to_csv('out.csv')

    region_df = trends_by_country("vaccine", yearAgo, today)
    region_df.to_csv('regions.csv')