import csv
from django.core.management.base import BaseCommand
from myapp.models import ChildBMI

class Command(BaseCommand):
    help = 'Import data from a CSV file into the model'

    def handle(self, *args, **options):
        csv_files = [
            "data/bmi_1.csv",
            "data/bmi_2.csv",
            "data/bmi_3.csv",
            "data/bmi_4.csv",
            "data/bmi_5.csv",
            "data/bmi_6.csv",
            "data/bmi_7.csv",
            "data/bmi_8.csv",
            "data/bmi_9.csv",
            "data/bmi_10.csv",
            "data/bmi_11.csv",
            "data/bmi_12.csv",
        ]

        for csv_file in csv_files:
            with open(csv_file, 'r') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    model_instance = ChildBMI.objects.create(
                        RSID=row["RSID"],
                        CHR=row["CHR"],
                        BP=row["BP"],
                        BETA=row["BETA"],
                        SE=row["SE"],
                        P=row["P"],
                        AGE=row["AGE"],
                        cBP=row["cBP"]
                    )
                    model_instance.save()

        self.stdout.write(self.style.SUCCESS('Data imported successfully'))

