import requests
from bs4 import BeautifulSoup
import os
import matplotlib.pyplot as plt
import pandas as pd
from nltk.sentiment.vader import SentimentIntensityAnalyzer

url = "https://abcnews.go.com/GMA/Culture/review-10-best-movies-2023/story?id=105786708"
#https://mashable.com/article/best-netflix-movies-2023
response = requests.get(url)

soup = BeautifulSoup(response.text, "html.parser")
articles = soup.find_all("p")

print(articles[0].text.strip())

#The main package that contains functions to use Hugging Face‹
import transformers 
from transformers import pipeline
import os
from transformers.pipelines import PIPELINE_REGISTRY
#Set to avoid warning messages.
transformers.logging.set_verbosity_error()
PIPELINE_REGISTRY.get_supported_tasks()
PIPELINE_REGISTRY.check_task('sentiment-analysis')[1].get('default')
sentiment_classifier = pipeline("sentiment-analysis")

sentiment_results=sentiment_classifier(articles[0].text.strip())
print(sentiment_results)

# Create a Pickle file
import pickle
pickle_out = open("classifier.pkl","wb")
pickle.dump(sentiment_classifier, pickle_out)
pickle_out.close()