# Provjerimo dali ima veze sa Youtube
import requests
url = "https://www.youtube.com/"
timeout = 5
def is_connected():
    try:
        request = requests.get(url, timeout=timeout)
        print("Connected to the Internet")
        return True
    except (requests.ConnectionError, requests.Timeout) as exception:
        print("No INTERNET")
        return False