from django.shortcuts import render
from django.http import JsonResponse, HttpResponse

from Bio import Entrez
Entrez.email = "youremail@gmail.com"

from myapp.models import ChildBMI


# Create your views here.

#Get chart / index
def chart_view(request):
    return render(request, "index.html")

def get_manhattan_data(request, selectedAge):
    selected_age = float(selectedAge)
    data = list(ChildBMI.objects.filter(AGE=selected_age, P__lte=0.05).values()) #Displaying filtered P-values
    return JsonResponse({"data": data, "selectedAge": str(selected_age)})

def get_temporal_data(request, selectedID):
    data = list(ChildBMI.objects.filter(RSID=selectedID).values())
    return JsonResponse({"data": data, "selectedID": selectedID})

# Get gene from NCBI dbSNP database (may lag)
def get_gene_for_snp(request, selectedID):
    snp_id = selectedID
    if snp_id:
        record = Entrez.read(Entrez.elink(dbfrom="snp", id=snp_id.replace('rs',''), db="gene"))
        results = record[0]['LinkSetDb'][0]['Link']
        for result in results:
            uid = result['Id']
            handle = Entrez.esummary(db="gene", id=uid)
            uid_record = Entrez.read(handle)
            handle.close()
            uid_summary = uid_record["DocumentSummarySet"]['DocumentSummary'][0]
            gene_name = uid_summary['Name']
            
            return JsonResponse({"gene": gene_name, "selectedID": selectedID})
    else:
        return JsonResponse({'error': 'No SNP ID provided'}, status=400)


