from django.db import models


class Plant(models.Model):
	name = models.CharField(max_length=5000)
	FO = models.CharField(max_length=5000)
	ground = models.CharField(max_length=5000)
	chem = models.CharField(max_length=5000)
	drugs = models.CharField(max_length=5000)

	def __str__(self):
		return self.name
