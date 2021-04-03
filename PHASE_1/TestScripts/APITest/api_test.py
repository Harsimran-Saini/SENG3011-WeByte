import requests

base_url = "https://nsg2nkvz9l.execute-api.ap-southeast-2.amazonaws.com/we-byte/"


def test_search_keywords_basic_200():
    url = base_url + "search-keywords"
    params = {
        "key_terms": "[\"covid\"]",
        "start_date": "2020-01-01",
        "end_date": "2021-03-26"
    }

    response = requests.get(url, params)
    print(response.url)
    assert response.status_code == 200

    response_json = dict(response.json())
    print(response_json["articles"].keys())
    assert {"archive_id", "url", "date", "headline", "main_text", "summary", "reports"}.issubset(
        response_json["articles"]["covid"][0].keys())


def test_search_keywords_multiple_keywords_200():
    url = base_url + "search-keywords?key_terms=%5B%22covid%22%2C%20%22other%22%5D&start_date=2020-01-01&end_date=2021-03-26"

    response = requests.get(url)
    print(response.url)
    assert response.status_code == 200

    response_json = response.json()
    assert {"archive_id", "url", "date", "headline", "main_text", "summary", "reports"}.issubset(
        response_json["articles"]["covid"][0].keys())


def test_search_keywords_location_200():
    url = base_url + "search-keywords"
    params = {
        "key_terms": "[\"covid\"]",
        "start_date": "2020-01-01",
        "end_date": "2021-03-26",
        "location": "Australia"
    }

    response = requests.get(url, params)
    print(response.url)
    assert response.status_code == 200

    response_json = response.json()
    assert {"archive_id", "url", "date", "headline", "main_text", "summary", "reports"}.issubset(
        response_json["articles"]["covid"][0].keys())


def test_search_keywords_missing_required_end_date():
    url = base_url + "search-keywords"
    params = {
        "key_terms": "[\"covid\"]",
        "start_date": "2020-01-01"
    }

    response = requests.get(url, params)
    print(response.url)
    assert "Error" in response.json().keys()
    assert response.status_code == 400


def test_search_keywords_missing_required_start_date():
    url = base_url + "search-keywords"
    params = {
        "key_terms": "[\"covid\"]",
        "end_date": "2020-01-01"
    }

    response = requests.get(url, params)
    print(response.url)
    assert "Error" in response.json().keys()
    assert response.status_code == 400


def test_search_keywords_invalid_start_date_400():
    url = base_url + "search-keywords"
    params = {
        "key_terms": "[\"covid\"]",
        "start_date": "banana",
        "end_date": "2021-03-26",
    }

    response = requests.get(url, params)
    print(response.url)
    assert "Error" in response.json().keys()
    assert response.status_code == 400


def test_search_keywords_invalid_end_date_400():
    url = base_url + "search-keywords"
    params = {
        "key_terms": "[\"banana\"]",
        "start_date": "2020-01-01",
        "end_date": "banana",
    }

    response = requests.get(url, params)
    print(response.url)
    assert "Error" in response.json().keys()
    assert response.status_code == 400


def test_search_keywords_invalid_date_order():
    url = base_url + "search-keywords"
    params = {
        "key_terms": "[\"banana\"]",
        "start_date": "2020-01-01",
        "end_date": "2000-00-05",
    }

    response = requests.get(url, params)
    print(response.url)
    assert "Error" in response.json().keys()
    assert response.status_code == 400


def test_article_200():
    url = base_url + "article"
    params = {
        "id": 8202225
    }

    response = requests.get(url, params)
    print(response.url)

    assert response.status_code == 200

    response_json = response.json()
    assert {"archive_id", "url", "date", "headline", "reports"}.issubset(response_json["articles"][0].keys())


def test_article_invalid_id_400():
    url = base_url + "article"
    params = {
        "id": "banana"
    }

    response = requests.get(url, params)
    print(response.url)
    assert response.status_code == 400


def test_latest_articles_200():
    url = base_url + "latest_articles"
    params = {
        "n_articles": "50"
    }

    response = requests.get(url, params)
    print(response.url)
    assert response.status_code == 200

    response_json = response.json()
    assert {"archive_id", "url", "date", "headline", "reports"}.issubset(response_json["articles"][0].keys())


def test_latest_articles_invalid_n_articles_403():
    url = base_url + "latest_articles"
    params = {
        "n_articles": "banana"
    }

    response = requests.get(url, params)
    print(response.url)
    assert response.status_code == 403
