# The Influence of Genetics on Childhood BMI

Differences in our genetic code play a role in growth and obesity during childhood. This data scrollytelling prototype looks at the association between genetic variation and childhood body mass index (BMI). 

![](Demo_Final.mp4)

The prototype starts with a scroll-driven narrative that onboards the user to GWAS concepts. The onboarding ends with a coordinated view of a radial Manhattan plot on the left side of the screen linked to a linear temporal forest plot on the right. The onboarding narrative teaches users how to interpret GWAS visualizations before they are able to freely explore them.

The Manhattan plot visualizes genetic variants (SNPs) on the x-axis against their likelihood of influencing BMI in childhood (-log(p-value)) on the y-axis. The temporal forest plot displays a selected SNP's effect size (beta coefficients standardized by sex and gestational age) and standard error of the mean (SEM) over 12 timepoints during childhood (birth, 6wk, 3m, 6m, 8m, 1y, 1.5y, 2y, 3y, 5y, 7y, 8y). 

## Data Sources

The data and content of the story is sourced from Helgeland et al.'s GWAS publication on early childhood BMI [Characterization of the genetic architecture of infant and early childhood body mass index](https://www.nature.com/articles/s42255-022-00549-1). The article identifies 40 SNPs of interest that are highlighted in the Manhattan visualization. The dataset is available at [MoBa GWAS summary data](https://www.fhi.no/en/ch/studies/moba/for-forskere-artikler/gwas-data-from-moba/). The project also fetches genes associated with SNPs through the [NCBI dbSNP Database](https://www.ncbi.nlm.nih.gov/snp/) via Entrez API.

## Tools
This project was built with 
- [Django v5.0.4](https://www.djangoproject.com/)
- [D3 v7.9.0](https://d3js.org/getting-started)
- [Scrollama v3.2.0](https://github.com/russellsamora/scrollama) with [InteractionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

## Running the project

In a terminal:

Set up a virtual environment, for example:
``` 
python3 -m venv .venv
source .venv/bin/activate
```
Install requirements. May need to install Bio without a version number.
``` 
pip install -r requirements.txt
```
Create database tables in Django application.
``` 
python3 manage.py makemigrations
python3 manage.py migrate
```
Import csv data into Django model. This can take up to 20 minutes.
``` 
python3 manage.py import_data
```
Run Django development server. 
``` 
python3 manage.py runserver
```
Upon successful launch, access the server address via web browser. 

## Interactions
Scroll to progress through the story.
At the end of the story, you will be able to freely explore the two linked charts. 
- Click to select a SNP on the manhattan plot. This will show its temporal forest plot view.
- Click to rotate the manhattan plot to see the hidden side.
- Hover to view tooltips.

## Notes
- The project is best viewed fullscreen on a 14" Macbook Pro on Chrome Incognito Mode v125.0.6422.142, screen size 1509x3848px. It is not responsive to different screen sizes. It has only been test on Chrome.
- Try to scroll at a regular or slow pace. When scrolling quickly, animations cannot keep up and may need a page refresh.
- There may be a small lag in updating visualizations while fetching data from the NCBI dbSNP database

## Resources
Helgeland, Ø., Vaudel, M., Sole-Navais, P. et al. Characterization of the genetic architecture of infant and early childhood body mass index. Nat Metab 4, 344–358 (2022). https://doi.org/10.1038/s42255-022-00549-1 

Scrollytelling demo using scrollama.js and d3.js by edriessen https://github.com/edriessen/scrollytelling-scrollama-d3-demo

Fullstack D3 and Data Visualization https://fullstack.io/fullstack-d3 / https://github.com/73nko/advanced-d3

What is Finngen? by Department of Art and Media, Aalto University https://geneviz.aalto.fi/what-is-finngen/

Polygenic Risk Scores by Pattern, Broad Institute https://polygenicscores.org/explained/

MoBa Explorer by Hanna Balaka
https://conferences.eg.org/vcbm2023/wp-content/uploads/sites/19/2023/09/Balaka_23PosterAbstract.pdf

ChatGPT was used for problem solving / troubleshooting.
