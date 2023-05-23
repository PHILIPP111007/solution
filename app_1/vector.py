import pickle

from solution.settings import BASE_DIR

import __main__

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import PCA
from numpy.linalg import norm


model_path = BASE_DIR / 'app_1/model.pkl'

class Model():

    def __init__(self, file):
        self.file = file
        self.pca = PCA(n_components=60)
        self.tfidf = TfidfVectorizer()

        df = pd.read_csv(self.file)
        names = df['Название'].values[:100]
        self.plants = list(map(lambda x: x.lower(), names))
        train = df['Федеральные округa'] + " " + df['Типы почв']
        train = train[:100]
        vals = train.values
        self.final = self.txt_preprocess(vals)

        self._fit()

    def _txt_preprocess(self, text):
        final = []
        for i in text:
            no_punc = i.replace(',',' ')
            tokens = no_punc.split()
            normal = []
            for j in tokens:
                normal.append(j.lower())
            
            stroka = ' '.join(normal)
            final.append(stroka)
    
        return final

    def _fit(self):
        tfidf_vecs = self.tfidf.fit_transform(self.final).toarray()
        self.reduced = self.pca.fit_transform(tfidf_vecs)
  
    def check_proba(self,name,discr):
        stroka = [discr]
        ready = self._txt_preprocess(stroka)
        
        vec = self.tfidf.transform(ready).toarray()

        reduced_vec = self.pca.transform(vec)[0]

        idx = self.plants.index(name.lower())
        real = self.reduced[idx]

        cos_sim = np.dot(real,reduced_vec) / (norm(real) * norm(reduced_vec))

        if cos_sim <= 0:
            cos_sim = 0
        else:
            cos_sim = int(cos_sim * 100)

        return cos_sim


setattr(__main__, "Model", Model)

model = pickle.load(open(model_path, 'rb'))
