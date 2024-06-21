from django.db import models

# Create your models here.

class ChildBMI(models.Model):
    RSID = models.CharField(max_length=100)
    CHR = models.IntegerField(null=True)
    BP = models.IntegerField(null=True)
    BETA = models.FloatField(null=True)
    SE = models.FloatField(null=True)
    P = models.FloatField(null=True)
    AGE = models.FloatField(null=True)
    cBP = models.IntegerField(null=True)

    def save(self, *args, **kwargs):
        if self.SE == "":
            self.SE = 0
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.RSID