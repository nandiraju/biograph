export interface OncologyNode {
  id: string;
  label: string;
  type: 'patient' | 'gene' | 'variant' | 'cancer' | 'drug' | 'trial' | 'biomarker';
  val: number;
  color: string;
  details: {
    title: string;
    subtitle?: string;
    description: string;
    meta?: Record<string, string | number | string[]>;
    stats?: { label: string; value: string | number }[];
  };
}

export interface OncologyLink {
  source: string;
  target: string;
  type: 'has_mutation' | 'has_biomarker' | 'variant_of' | 'associated_cancer' | 'targets' | 'evaluated_in' | 'recruiting_for' | 'co_occurrence' | 'diagnosed_with';
  color: string;
  width: number;
  dashed?: boolean;
}

export interface OncologyData {
  nodes: OncologyNode[];
  links: OncologyLink[];
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED ENTITY POOLS
// ─────────────────────────────────────────────────────────────────────────────

const CANCER_NODES: OncologyNode[] = [
  { id:'CA-BREAST',      label:'Breast Cancer',        type:'cancer', val:14, color:'#ff2a85', details:{ title:'Breast Cancer (HR+/HER2-)', subtitle:'Oncology Indication', description:'Most common cancer in women globally. Luminal subtypes driven by ER/PR/HER2 status. PIK3CA mutations frequent.', stats:[{label:'Global Cases/yr',value:'2.3M'},{label:'Key Drivers',value:'PIK3CA, TP53, BRCA1/2'}] } },
  { id:'CA-NSCLC',       label:'NSCLC',                type:'cancer', val:14, color:'#ff2a85', details:{ title:'Non-Small Cell Lung Cancer', subtitle:'Oncology Indication', description:'~85% of lung cancers. Adenocarcinoma and squamous subtypes. EGFR/ALK/KRAS are key druggable drivers.', stats:[{label:'5yr Survival',value:'7%'},{label:'Drivers',value:'EGFR, ALK, KRAS, ROS1'}] } },
  { id:'CA-OVARIAN',     label:'Ovarian Cancer',       type:'cancer', val:12, color:'#ff2a85', details:{ title:'Ovarian Cancer (HGSOC)', subtitle:'Oncology Indication', description:'Epithelial serous ovarian cancer. 50% HRD positive. Late-stage diagnosis typical.', stats:[{label:'HRD Rate',value:'50%'},{label:'Therapy',value:'Platinum + PARP Inhibitor'}] } },
  { id:'CA-COLORECTAL',  label:'Colorectal Cancer',    type:'cancer', val:12, color:'#ff2a85', details:{ title:'Colorectal Cancer (CRC)', subtitle:'Oncology Indication', description:'RAS/RAF driven. MMR status determines immunotherapy eligibility.', stats:[{label:'Common Alts',value:'KRAS, APC, TP53, BRAF'},{label:'ICI Match',value:'dMMR/MSI-H'}] } },
  { id:'CA-PROSTATE',    label:'Prostate Cancer',      type:'cancer', val:12, color:'#ff2a85', details:{ title:'Prostate Adenocarcinoma', subtitle:'Oncology Indication', description:'AR-driven. BRCA2 mutations confer PARP inhibitor sensitivity. Castration-resistant forms require novel AR pathway targeting.', stats:[{label:'AR Targeting',value:'Enzalutamide, Abiraterone'},{label:'BRCA2 Freq',value:'10-15% mCRPC'}] } },
  { id:'CA-PANCREATIC',  label:'Pancreatic Cancer',    type:'cancer', val:11, color:'#ff2a85', details:{ title:'Pancreatic Ductal Adenocarcinoma', subtitle:'Oncology Indication', description:'KRAS driver in >90%. Poor prognosis. BRCA1/2 and ATM mutations offer PARP inhibitor opportunities.', stats:[{label:'5yr Survival',value:'12%'},{label:'KRAS Freq',value:'>90%'}] } },
  { id:'CA-MELANOMA',    label:'Melanoma',             type:'cancer', val:11, color:'#ff2a85', details:{ title:'Cutaneous Melanoma', subtitle:'Oncology Indication', description:'BRAF V600 mutated in 50%. High TMB makes it responsive to immunotherapy. MEK inhibitors used in combination.', stats:[{label:'BRAF Freq',value:'50%'},{label:'IO Response',value:'40-50% ORR'}] } },
  { id:'CA-GBM',         label:'Glioblastoma',         type:'cancer', val:10, color:'#ff2a85', details:{ title:'Glioblastoma Multiforme (GBM)', subtitle:'Oncology Indication', description:'Aggressive CNS tumor. EGFR amplification, IDH1 mutations in younger patients. Poor prognosis.', stats:[{label:'Median OS',value:'15 months'},{label:'IDH1 Freq',value:'5-10% GBM'}] } },
  { id:'CA-BLADDER',     label:'Bladder Cancer',       type:'cancer', val:10, color:'#ff2a85', details:{ title:'Urothelial Bladder Cancer', subtitle:'Oncology Indication', description:'FGFR3 alterations in low-grade tumors. High TMB in muscle-invasive. Erdafitinib targets FGFR3.', stats:[{label:'FGFR3 Freq',value:'~20%'},{label:'TMB',value:'High in MIBC'}] } },
  { id:'CA-HCC',         label:'Hepatocellular Ca.',   type:'cancer', val:10, color:'#ff2a85', details:{ title:'Hepatocellular Carcinoma (HCC)', subtitle:'Oncology Indication', description:'Associated with cirrhosis and viral hepatitis. VEGF pathway targeting with sorafenib/lenvatinib. Atezolizumab+bevacizumab as first-line.', stats:[{label:'VEGF Target',value:'Sorafenib, Lenvatinib'},{label:'IO Combo',value:'Atezo+Bev'}] } },
  { id:'CA-GASTRIC',     label:'Gastric Cancer',       type:'cancer', val:10, color:'#ff2a85', details:{ title:'Gastric/GEJ Adenocarcinoma', subtitle:'Oncology Indication', description:'HER2 amplification in 15-20%. Claudin-18.2 is emerging target. High MSI tumors respond to immunotherapy.', stats:[{label:'HER2+',value:'15-20%'},{label:'MSI-H Freq',value:'~10%'}] } },
  { id:'CA-AML',         label:'AML',                  type:'cancer', val:10, color:'#ff2a85', details:{ title:'Acute Myeloid Leukemia (AML)', subtitle:'Oncology Indication', description:'FLT3-ITD in 30%. IDH1/2 mutations targetable with enasidenib/ivosidenib. NPM1 mutations common.', stats:[{label:'FLT3-ITD Freq',value:'30%'},{label:'IDH1/2 Freq',value:'20%'}] } },
];

const GENE_NODES: OncologyNode[] = [
  { id:'PIK3CA', label:'PIK3CA', type:'gene', val:9, color:'#ff7b00', details:{ title:'PIK3CA (PI3K Catalytic Subunit Alpha)', subtitle:'Oncogene • Chr 3q26.32', description:'Encodes p110α of PI3K. Activating mutations hyperactivate AKT/mTOR.', stats:[{label:'HR+ Breast Freq',value:'35%'},{label:'Inhibitor',value:'Alpelisib'}] } },
  { id:'TP53',   label:'TP53',   type:'gene', val:9, color:'#ff7b00', details:{ title:'TP53 (Tumor Protein p53)', subtitle:'Tumor Suppressor • Chr 17p13.1', description:'Guardian of the genome. Loss enables genomic instability.', stats:[{label:'Pan-Cancer',value:'>50%'},{label:'Strategy',value:'APR-246, PC14586'}] } },
  { id:'EGFR',   label:'EGFR',   type:'gene', val:9, color:'#ff7b00', details:{ title:'EGFR (Epidermal Growth Factor Receptor)', subtitle:'Oncogene / RTK • Chr 7p11.2', description:'Activating mutations drive proliferation. NSCLC key target.', stats:[{label:'NSCLC Western',value:'15%'},{label:'TKIs',value:'Osimertinib'}] } },
  { id:'KRAS',   label:'KRAS',   type:'gene', val:9, color:'#ff7b00', details:{ title:'KRAS (KRAS Proto-Oncogene)', subtitle:'Oncogene / RAS • Chr 12p12.1', description:'GTPase. Activating mutations impair GTP hydrolysis.', stats:[{label:'Pancreatic Freq',value:'90%'},{label:'G12C Drug',value:'Sotorasib'}] } },
  { id:'BRCA1',  label:'BRCA1',  type:'gene', val:8, color:'#ff7b00', details:{ title:'BRCA1 (DNA Repair Associated)', subtitle:'Tumor Suppressor / HRR • Chr 17q21.31', description:'HRR repair. Inactivation causes HRD and PARP inhibitor sensitivity.', stats:[{label:'Drug Match',value:'PARP Inhibitors'},{label:'Cancers',value:'Breast, Ovarian'}] } },
  { id:'BRCA2',  label:'BRCA2',  type:'gene', val:8, color:'#ff7b00', details:{ title:'BRCA2 (DNA Repair Associated)', subtitle:'Tumor Suppressor / HRR • Chr 13q12.3', description:'HRR repair. Mutations in breast, ovarian, pancreatic, prostate.', stats:[{label:'Drug Match',value:'Olaparib, Rucaparib'},{label:'mCRPC Freq',value:'10-15%'}] } },
  { id:'ALK',    label:'ALK',    type:'gene', val:8, color:'#ff7b00', details:{ title:'ALK (ALK Receptor Tyrosine Kinase)', subtitle:'Oncogene / Kinase • Chr 2p23.2', description:'EML4-ALK fusions drive NSCLC. Highly targetable.', stats:[{label:'NSCLC Freq',value:'3-5%'},{label:'TKIs',value:'Alectinib, Lorlatinib'}] } },
  { id:'BRAF',   label:'BRAF',   type:'gene', val:8, color:'#ff7b00', details:{ title:'BRAF (B-Raf Proto-Oncogene)', subtitle:'Oncogene / MAPK • Chr 7q34', description:'V600E hotspot activates MEK/ERK. Melanoma, CRC, thyroid.', stats:[{label:'Melanoma Freq',value:'50%'},{label:'Inhibitors',value:'Vemurafenib, Dabrafenib'}] } },
  { id:'MET',    label:'MET',    type:'gene', val:7, color:'#ff7b00', details:{ title:'MET (MET Proto-Oncogene)', subtitle:'Oncogene / RTK • Chr 7q31', description:'Exon 14 skipping in NSCLC. Amplification causes TKI resistance. Targeted by crizotinib, capmatinib.', stats:[{label:'NSCLC Exon14',value:'3-4%'},{label:'Drug',value:'Capmatinib'}] } },
  { id:'RET',    label:'RET',    type:'gene', val:7, color:'#ff7b00', details:{ title:'RET (Ret Proto-Oncogene)', subtitle:'Oncogene / RTK • Chr 10q11.21', description:'Fusions in NSCLC (~2%) and thyroid. Selpercatinib/Pralsetinib are selective RET inhibitors.', stats:[{label:'NSCLC Freq',value:'~2%'},{label:'Drug',value:'Selpercatinib'}] } },
  { id:'FGFR3',  label:'FGFR3',  type:'gene', val:7, color:'#ff7b00', details:{ title:'FGFR3 (Fibroblast Growth Factor Receptor 3)', subtitle:'Oncogene / RTK • Chr 4p16.3', description:'Mutations/fusions in bladder cancer. Erdafitinib specifically targets FGFR3 alterations.', stats:[{label:'Bladder Freq',value:'~20%'},{label:'Drug',value:'Erdafitinib'}] } },
  { id:'IDH1',   label:'IDH1',   type:'gene', val:7, color:'#ff7b00', details:{ title:'IDH1 (Isocitrate Dehydrogenase 1)', subtitle:'Metabolic Enzyme Oncogene • Chr 2q34', description:'R132H mutation produces 2-HG oncometabolite. AML and glioma driver. Ivosidenib targets IDH1.', stats:[{label:'AML Freq',value:'7-10%'},{label:'Drug',value:'Ivosidenib'}] } },
  { id:'FLT3',   label:'FLT3',   type:'gene', val:7, color:'#ff7b00', details:{ title:'FLT3 (FMS-Like Tyrosine Kinase 3)', subtitle:'Oncogene / RTK • Chr 13q12.2', description:'ITD and TKD mutations in AML drive proliferation. Midostaurin and gilteritinib are FLT3 inhibitors.', stats:[{label:'AML ITD Freq',value:'30%'},{label:'Drug',value:'Midostaurin, Gilteritinib'}] } },
  { id:'NRAS',   label:'NRAS',   type:'gene', val:7, color:'#ff7b00', details:{ title:'NRAS (NRAS Proto-Oncogene)', subtitle:'Oncogene / RAS • Chr 1p13.2', description:'Q61K/R mutations in melanoma (~20%) and AML. MEK inhibitors partially effective.', stats:[{label:'Melanoma Freq',value:'20%'},{label:'AML Freq',value:'10%'}] } },
  { id:'ATM',    label:'ATM',    type:'gene', val:6, color:'#ff7b00', details:{ title:'ATM (ATM Serine/Threonine Kinase)', subtitle:'Tumor Suppressor / DDR • Chr 11q22.3', description:'DNA damage response kinase. Biallelic loss causes HRD, conferring PARP inhibitor sensitivity.', stats:[{label:'Pancreatic Freq',value:'~5-10%'},{label:'Drug Match',value:'PARP Inhibitors'}] } },
  { id:'PTEN',   label:'PTEN',   type:'gene', val:6, color:'#ff7b00', details:{ title:'PTEN (Phosphatase and Tensin Homolog)', subtitle:'Tumor Suppressor • Chr 10q23.3', description:'Negative regulator of PI3K/AKT. Loss is synthetic lethal with PIK3CA mutations. Common in prostate and endometrial cancers.', stats:[{label:'Prostate Freq',value:'40-70%'},{label:'Pathway',value:'PI3K/AKT'}] } },
  { id:'HER2',   label:'HER2',   type:'gene', val:7, color:'#ff7b00', details:{ title:'HER2 (ERBB2)', subtitle:'Oncogene / RTK • Chr 17q12', description:'Amplification drives breast, gastric, lung (rare) cancers. Trastuzumab, pertuzumab, T-DM1, trastuzumab deruxtecan target HER2.', stats:[{label:'Breast Freq',value:'15-20%'},{label:'Gastric Freq',value:'15-20%'}] } },
  { id:'CDKN2A', label:'CDKN2A', type:'gene', val:6, color:'#ff7b00', details:{ title:'CDKN2A (p16/ARF)', subtitle:'Tumor Suppressor • Chr 9p21.3', description:'Encodes p16INK4A (CDK4/6 inhibitor) and p14ARF (TP53 activator). Deletion common in melanoma, NSCLC.', stats:[{label:'Melanoma Freq',value:'>50%'},{label:'NSCLC Freq',value:'~25%'}] } },
  { id:'APC',    label:'APC',    type:'gene', val:6, color:'#ff7b00', details:{ title:'APC (Adenomatous Polyposis Coli)', subtitle:'Tumor Suppressor • Chr 5q22.2', description:'Gatekeeper of WNT signaling. Truncating mutations initiate colorectal carcinogenesis. FAP syndrome gene.', stats:[{label:'CRC Freq',value:'>80%'},{label:'Pathway',value:'WNT/β-catenin'}] } },
  { id:'ROS1',   label:'ROS1',   type:'gene', val:6, color:'#ff7b00', details:{ title:'ROS1 (ROS Proto-Oncogene 1)', subtitle:'Oncogene / RTK • Chr 6q22.1', description:'Fusions in NSCLC (~1-2%). Highly sensitive to crizotinib, entrectinib, lorlatinib.', stats:[{label:'NSCLC Freq',value:'1-2%'},{label:'Drug',value:'Crizotinib, Entrectinib'}] } },
];

const VARIANT_NODES: OncologyNode[] = [
  { id:'VAR-PIK3CA-H1047R', label:'PIK3CA H1047R', type:'variant', val:5, color:'#b624ff', details:{ title:'PIK3CA p.H1047R', subtitle:'Missense • Exon 21', description:'Kinase domain hotspot. Alpelisib companion diagnostic target.', meta:{'AA Change':'H1047R','ClinVar':'Pathogenic','Tier':'IA'}, stats:[{label:'VAF',value:'15-45%'},{label:'Drug',value:'Alpelisib'}] } },
  { id:'VAR-PIK3CA-E545K',  label:'PIK3CA E545K',  type:'variant', val:5, color:'#b624ff', details:{ title:'PIK3CA p.E545K', subtitle:'Missense • Exon 9', description:'Helical domain hotspot. Constitutive PI3K activation.', meta:{'AA Change':'E545K','ClinVar':'Pathogenic'}, stats:[{label:'Freq',value:'~10% HR+ Breast'},{label:'Drug',value:'Alpelisib'}] } },
  { id:'VAR-TP53-R273H',    label:'TP53 p.R273H',   type:'variant', val:5, color:'#b624ff', details:{ title:'TP53 p.R273H', subtitle:'Missense • Exon 8', description:'DNA-contact mutation. Loss of p53 tumour suppression.', meta:{'ClinVar':'Pathogenic','Hotspot':'Yes'}, stats:[{label:'Prognosis',value:'Poor'}] } },
  { id:'VAR-TP53-Y220C',    label:'TP53 p.Y220C',   type:'variant', val:5, color:'#b624ff', details:{ title:'TP53 p.Y220C', subtitle:'Structural Missense • Exon 6', description:'Creates cavity destabilising p53.', meta:{'ClinVar':'Pathogenic'}, stats:[{label:'Trial Drug',value:'PC14586'}] } },
  { id:'VAR-TP53-R175H',    label:'TP53 p.R175H',   type:'variant', val:5, color:'#b624ff', details:{ title:'TP53 p.R175H', subtitle:'Missense • Exon 5', description:'Most frequent TP53 hotspot. Dominant-negative gain-of-function.', meta:{'ClinVar':'Pathogenic'}, stats:[{label:'GOF Activity',value:'Yes'}] } },
  { id:'VAR-EGFR-L858R',    label:'EGFR p.L858R',   type:'variant', val:5, color:'#b624ff', details:{ title:'EGFR p.L858R', subtitle:'Missense • Exon 21', description:'Major activating hotspot. Sensitive to all EGFR TKI generations.', meta:{'ClinVar':'Pathogenic','Tier':'IA'}, stats:[{label:'Drug',value:'Osimertinib'}] } },
  { id:'VAR-EGFR-DEL19',    label:'EGFR Exon19del', type:'variant', val:5, color:'#b624ff', details:{ title:'EGFR Exon 19 Deletion', subtitle:'In-Frame Deletion • Exon 19', description:'Most common EGFR sensitising mutation (~45%). Best OS with Osimertinib.', meta:{'ClinVar':'Pathogenic'}, stats:[{label:'Drug',value:'Osimertinib'}] } },
  { id:'VAR-EGFR-T790M',    label:'EGFR p.T790M',   type:'variant', val:5, color:'#b624ff', details:{ title:'EGFR p.T790M', subtitle:'Gatekeeper • Exon 20', description:'Acquired resistance to 1st-gen TKIs. Sensitive to Osimertinib.', meta:{'ClinVar':'Pathogenic'}, stats:[{label:'Drug',value:'Osimertinib'}] } },
  { id:'VAR-KRAS-G12C',     label:'KRAS p.G12C',    type:'variant', val:5, color:'#b624ff', details:{ title:'KRAS p.G12C', subtitle:'Hotspot • Exon 2', description:'Cys substitution locks KRAS active. Covalent inhibitors trap GDP-bound form.', meta:{'ClinVar':'Pathogenic','Tier':'IA'}, stats:[{label:'Drug',value:'Sotorasib, Adagrasib'}] } },
  { id:'VAR-KRAS-G12D',     label:'KRAS p.G12D',    type:'variant', val:5, color:'#b624ff', details:{ title:'KRAS p.G12D', subtitle:'Hotspot • Exon 2', description:'Common CRC and pancreatic driver. Historically undruggable.', meta:{'ClinVar':'Pathogenic'}, stats:[{label:'Investigational',value:'MRTX1133'}] } },
  { id:'VAR-KRAS-G12V',     label:'KRAS p.G12V',    type:'variant', val:5, color:'#b624ff', details:{ title:'KRAS p.G12V', subtitle:'Hotspot • Exon 2', description:'Val substitution. Common in pancreatic and lung cancer.', meta:{'ClinVar':'Pathogenic'}, stats:[{label:'Pancreatic Freq',value:'24%'}] } },
  { id:'VAR-BRAF-V600E',    label:'BRAF p.V600E',   type:'variant', val:5, color:'#b624ff', details:{ title:'BRAF p.V600E', subtitle:'Hotspot • Exon 15', description:'Most common BRAF mutation. Constitutive MEK/ERK activation. Vemurafenib target.', meta:{'ClinVar':'Pathogenic','Tier':'IA'}, stats:[{label:'Drug',value:'Dabrafenib+Trametinib'}] } },
  { id:'VAR-BRCA1-5266',    label:'BRCA1 5266dupC', type:'variant', val:5, color:'#b624ff', details:{ title:'BRCA1 c.5266dupC', subtitle:'Frameshift • Exon 20', description:'Ashkenazi founder mutation. Truncation causes HRD.', meta:{'ClinVar':'Pathogenic (Germline)'}, stats:[{label:'Drug',value:'PARP Inhibitors'}] } },
  { id:'VAR-BRCA2-6174',    label:'BRCA2 6174delT', type:'variant', val:5, color:'#b624ff', details:{ title:'BRCA2 c.6174delT', subtitle:'Frameshift • Exon 11', description:'Ashkenazi founder mutation in BRCA2. HRD phenotype.', meta:{'ClinVar':'Pathogenic (Germline)'}, stats:[{label:'Drug',value:'Olaparib, Rucaparib'}] } },
  { id:'VAR-ALK-FUSION',    label:'EML4-ALK Fusion', type:'variant', val:5, color:'#b624ff', details:{ title:'EML4-ALK Fusion', subtitle:'Structural Rearrangement', description:'Constitutive ALK kinase activity. Highly targetable.', meta:{'ClinVar':'Pathogenic','Tier':'IA'}, stats:[{label:'Drug',value:'Alectinib, Lorlatinib'}] } },
  { id:'VAR-MET-EX14',      label:'MET Exon14skip', type:'variant', val:5, color:'#b624ff', details:{ title:'MET Exon 14 Skipping', subtitle:'Splice Site Alteration', description:'Leads to MET protein stabilisation and oncogenic signalling.', meta:{'ClinVar':'Pathogenic','Tier':'IIA'}, stats:[{label:'Drug',value:'Capmatinib, Tepotinib'}] } },
  { id:'VAR-RET-FUSION',    label:'RET Fusion',      type:'variant', val:5, color:'#b624ff', details:{ title:'RET Gene Fusion', subtitle:'Structural Rearrangement', description:'KIF5B-RET and CCDC6-RET common in NSCLC. Selpercatinib highly effective.', meta:{'ClinVar':'Pathogenic'}, stats:[{label:'Drug',value:'Selpercatinib'}] } },
  { id:'VAR-FGFR3-MUT',     label:'FGFR3 Mutation', type:'variant', val:5, color:'#b624ff', details:{ title:'FGFR3 Activating Mutation', subtitle:'Missense / Fusion', description:'S249C and R248W hotspots in bladder cancer. Erdafitinib companion diagnostic.', meta:{'ClinVar':'Pathogenic','Tier':'IIA'}, stats:[{label:'Drug',value:'Erdafitinib'}] } },
  { id:'VAR-IDH1-R132H',    label:'IDH1 p.R132H',   type:'variant', val:5, color:'#b624ff', details:{ title:'IDH1 p.R132H', subtitle:'Missense • Exon 4', description:'Produces 2-HG oncometabolite. AML and glioma. Ivosidenib targets IDH1.', meta:{'ClinVar':'Pathogenic','Tier':'IIA'}, stats:[{label:'Drug',value:'Ivosidenib'}] } },
  { id:'VAR-FLT3-ITD',      label:'FLT3-ITD',        type:'variant', val:5, color:'#b624ff', details:{ title:'FLT3 Internal Tandem Duplication', subtitle:'In-Frame Insertion • JM Domain', description:'Constitutive FLT3 kinase. Adverse prognosis in AML. Gilteritinib targets FLT3-ITD.', meta:{'ClinVar':'Pathogenic','Tier':'IIA'}, stats:[{label:'Drug',value:'Midostaurin, Gilteritinib'}] } },
  { id:'VAR-NRAS-Q61K',     label:'NRAS p.Q61K',    type:'variant', val:5, color:'#b624ff', details:{ title:'NRAS p.Q61K', subtitle:'Hotspot • Exon 3', description:'Impairs GTP hydrolysis. MEK inhibitors partially active.', meta:{'ClinVar':'Pathogenic'}, stats:[{label:'Melanoma Freq',value:'15-20%'}] } },
  { id:'VAR-PTEN-LOSS',     label:'PTEN Loss',       type:'variant', val:5, color:'#b624ff', details:{ title:'PTEN Deletion/Loss', subtitle:'Copy Number Loss / Truncation', description:'PI3K pathway hyperactivation. Ubiquitous in prostate cancer progression.', meta:{'ClinVar':'Pathogenic'}, stats:[{label:'Prostate Freq',value:'40-70%'}] } },
  { id:'VAR-HER2-AMP',      label:'HER2 Amplif.',   type:'variant', val:5, color:'#b624ff', details:{ title:'HER2 Gene Amplification', subtitle:'Copy Number Gain • Chr 17q12', description:'HER2 overexpression. Targeted by trastuzumab, pertuzumab, T-DXd.', meta:{'ClinVar':'Pathogenic','Tier':'IA'}, stats:[{label:'Drug',value:'Trastuzumab, T-DXd'}] } },
  { id:'VAR-ROS1-FUSION',   label:'ROS1 Fusion',    type:'variant', val:5, color:'#b624ff', details:{ title:'ROS1 Chromosomal Fusion', subtitle:'Structural Rearrangement', description:'CD74-ROS1 most common in NSCLC. Crizotinib, lorlatinib highly active.', meta:{'ClinVar':'Pathogenic','Tier':'IA'}, stats:[{label:'Drug',value:'Crizotinib, Entrectinib'}] } },
];

const BIOMARKER_NODES: OncologyNode[] = [
  { id:'BIO-ER-POS',     label:'ER-Positive',   type:'biomarker', val:4, color:'#ffe600', details:{ title:'Estrogen Receptor Positive (ER+)', subtitle:'Hormone Receptor', description:'Actionable for endocrine therapy. IHC ≥1%.', stats:[{label:'Therapy',value:'Tamoxifen, AIs'}] } },
  { id:'BIO-PR-POS',     label:'PR-Positive',   type:'biomarker', val:4, color:'#ffe600', details:{ title:'Progesterone Receptor Positive (PR+)', subtitle:'Hormone Receptor', description:'Positive prognostic indicator for endocrine therapy.', stats:[{label:'Subtype',value:'Luminal A/B'}] } },
  { id:'BIO-HER2-POS',   label:'HER2-Positive', type:'biomarker', val:4, color:'#ffe600', details:{ title:'HER2 Receptor Positive', subtitle:'Oncogene Expression', description:'IHC 3+ or FISH amplified. Anti-HER2 therapy indicated.', stats:[{label:'Drug',value:'Trastuzumab, Pertuzumab'}] } },
  { id:'BIO-HER2-NEG',   label:'HER2-Negative', type:'biomarker', val:4, color:'#ffe600', details:{ title:'HER2 Receptor Negative', subtitle:'Oncogene Expression', description:'Normal HER2 levels. Excludes standard HER2 therapies.', stats:[{label:'Relevance',value:'Luminal classification'}] } },
  { id:'BIO-PDL1-HIGH',  label:'PD-L1 High',    type:'biomarker', val:4, color:'#ffe600', details:{ title:'PD-L1 Expression High (TPS ≥50%)', subtitle:'Immune Checkpoint', description:'Predicts response to pembrolizumab monotherapy in NSCLC.', stats:[{label:'Drug',value:'Pembrolizumab 1L'}] } },
  { id:'BIO-PDL1-LOW',   label:'PD-L1 Low',     type:'biomarker', val:4, color:'#ffe600', details:{ title:'PD-L1 Expression Low (1-49%)', subtitle:'Immune Checkpoint', description:'IO + chemo combination preferred.', stats:[{label:'Strategy',value:'IO + Chemo combo'}] } },
  { id:'BIO-TMB-HIGH',   label:'TMB-High',       type:'biomarker', val:4, color:'#ffe600', details:{ title:'Tumor Mutational Burden High (≥10 mut/Mb)', subtitle:'Genomic Biomarker', description:'Pan-solid tumor pembrolizumab approval.', stats:[{label:'FDA Approval',value:'Pembrolizumab any TMB-H'}] } },
  { id:'BIO-MSI-H',      label:'MSI-H',          type:'biomarker', val:4, color:'#ffe600', details:{ title:'Microsatellite Instability High (MSI-H)', subtitle:'MMR / Genomic Biomarker', description:'dMMR/MSI-H tumors respond strongly to checkpoint inhibitors.', stats:[{label:'Drug',value:'Pembrolizumab (any tumor)'}] } },
  { id:'BIO-HRD-POS',    label:'HRD-Positive',   type:'biomarker', val:4, color:'#ffe600', details:{ title:'Homologous Recombination Deficiency (HRD+)', subtitle:'DNA Repair Biomarker', description:'Genomic scarring indicating HRR pathway dysfunction. PARP inhibitor sensitivity.', stats:[{label:'Drug',value:'Olaparib, Niraparib'}] } },
  { id:'BIO-BRAF-POS',   label:'BRAF V600+',     type:'biomarker', val:4, color:'#ffe600', details:{ title:'BRAF V600 Mutation Positive', subtitle:'Oncogenic Driver Biomarker', description:'Companion diagnostic for BRAF inhibitors in melanoma and CRC.', stats:[{label:'Drug',value:'Dabrafenib + Trametinib'}] } },
  { id:'BIO-KRAS-WT',    label:'KRAS Wild-Type', type:'biomarker', val:4, color:'#ffe600', details:{ title:'KRAS Wild-Type', subtitle:'RAS Status', description:'Eligibility for anti-EGFR therapy in mCRC. KRAS/NRAS/BRAF all WT required.', stats:[{label:'Drug',value:'Cetuximab, Panitumumab'}] } },
  { id:'BIO-PSA-HIGH',   label:'PSA Elevated',   type:'biomarker', val:4, color:'#ffe600', details:{ title:'PSA Elevated (Prostate Specific Antigen)', subtitle:'Serum Biomarker', description:'Rising PSA post-castration indicates castration-resistant progression.', stats:[{label:'Monitoring',value:'mCRPC progression'}] } },
  { id:'BIO-AFP-HIGH',   label:'AFP Elevated',   type:'biomarker', val:4, color:'#ffe600', details:{ title:'Alpha-Fetoprotein Elevated', subtitle:'Serum Biomarker', description:'Elevated in HCC. Used for monitoring and ramucirumab eligibility.', stats:[{label:'Cutoff',value:'>400 ng/mL (Ramucirumab)'}] } },
  { id:'BIO-CA125',      label:'CA-125 Elevated',type:'biomarker', val:4, color:'#ffe600', details:{ title:'CA-125 Elevated', subtitle:'Serum Biomarker', description:'Ovarian cancer monitoring biomarker. Rising CA-125 indicates progression.', stats:[{label:'Monitoring',value:'Ovarian cancer response'}] } },
  { id:'BIO-CEA',        label:'CEA Elevated',   type:'biomarker', val:4, color:'#ffe600', details:{ title:'Carcinoembryonic Antigen (CEA) Elevated', subtitle:'Serum Biomarker', description:'Elevated in colorectal, gastric, lung. Post-surgical monitoring marker.', stats:[{label:'Use',value:'CRC monitoring'}] } },
];

const DRUG_NODES: OncologyNode[] = [
  { id:'DR-ALPELISIB',      label:'Alpelisib',        type:'drug', val:6, color:'#00ff66', details:{ title:'Alpelisib (Piqray)', subtitle:'PI3Kα Inhibitor • Novartis', description:'Approved with Fulvestrant for HR+/HER2-/PIK3CA-mut breast cancer.', stats:[{label:'FDA',value:'May 2019'},{label:'Target',value:'PIK3CA'}] } },
  { id:'DR-OLAPARIB',       label:'Olaparib',         type:'drug', val:6, color:'#00ff66', details:{ title:'Olaparib (Lynparza)', subtitle:'PARP Inhibitor • AstraZeneca', description:'First-in-class PARP inhibitor. Synthetic lethality in HRD tumors.', stats:[{label:'FDA',value:'2014 (Ovarian)'},{label:'Target',value:'BRCA1/2, HRD'}] } },
  { id:'DR-NIRAPARIB',      label:'Niraparib',        type:'drug', val:6, color:'#00ff66', details:{ title:'Niraparib (Zejula)', subtitle:'PARP Inhibitor • GSK', description:'Maintenance PARP inhibitor for ovarian cancer. Approved regardless of BRCA status.', stats:[{label:'FDA',value:'2017 (Ovarian Maintenance)'},{label:'Target',value:'PARP1/2'}] } },
  { id:'DR-OSIMERTINIB',    label:'Osimertinib',      type:'drug', val:6, color:'#00ff66', details:{ title:'Osimertinib (Tagrisso)', subtitle:'3rd-Gen EGFR TKI • AstraZeneca', description:'Targets sensitising + T790M EGFR mutations. CNS penetrant.', stats:[{label:'FDA',value:'2015'},{label:'Target',value:'EGFR L858R, Del19, T790M'}] } },
  { id:'DR-SOTORASIB',      label:'Sotorasib',        type:'drug', val:6, color:'#00ff66', details:{ title:'Sotorasib (Lumakras)', subtitle:'KRAS G12C Inhibitor • Amgen', description:'First-in-class covalent KRAS G12C inhibitor.', stats:[{label:'FDA',value:'May 2021'},{label:'Target',value:'KRAS G12C'}] } },
  { id:'DR-ADAGRASIB',      label:'Adagrasib',        type:'drug', val:6, color:'#00ff66', details:{ title:'Adagrasib (Krazati)', subtitle:'KRAS G12C Inhibitor • Mirati', description:'CNS-penetrant KRAS G12C inhibitor. Active in brain metastases.', stats:[{label:'FDA',value:'Dec 2022'},{label:'Target',value:'KRAS G12C'}] } },
  { id:'DR-PEMBROLIZUMAB',  label:'Pembrolizumab',    type:'drug', val:6, color:'#00ff66', details:{ title:'Pembrolizumab (Keytruda)', subtitle:'Anti-PD-1 mAb • Merck', description:'Tissue-agnostic approvals for MSI-H, TMB-H. First-line NSCLC, melanoma.', stats:[{label:'FDA',value:'2014'},{label:'Biomarker',value:'PD-L1, MSI-H, TMB-H'}] } },
  { id:'DR-NIVOLUMAB',      label:'Nivolumab',        type:'drug', val:6, color:'#00ff66', details:{ title:'Nivolumab (Opdivo)', subtitle:'Anti-PD-1 mAb • BMS', description:'Approved in melanoma, NSCLC, GC, HCC, bladder, CRC (MSI-H), and more.', stats:[{label:'FDA',value:'2014'},{label:'Combinations',value:'Ipilimumab'}] } },
  { id:'DR-ALECTINIB',      label:'Alectinib',        type:'drug', val:6, color:'#00ff66', details:{ title:'Alectinib (Alecensa)', subtitle:'2nd-Gen ALK Inhibitor • Roche', description:'First-line standard for ALK+ NSCLC. Superior PFS and CNS control vs crizotinib.', stats:[{label:'FDA',value:'2015'},{label:'CNS',value:'81% response'}] } },
  { id:'DR-LORLATINIB',     label:'Lorlatinib',       type:'drug', val:6, color:'#00ff66', details:{ title:'Lorlatinib (Lorbrena)', subtitle:'3rd-Gen ALK/ROS1 TKI • Pfizer', description:'Broad ALK mutation coverage. Excellent CNS penetration. Covers most ALK resistance mechanisms.', stats:[{label:'FDA',value:'2018'},{label:'Mutations',value:'All ALK resistance'}] } },
  { id:'DR-DABRAFENIB',     label:'Dabrafenib+Tram',  type:'drug', val:6, color:'#00ff66', details:{ title:'Dabrafenib + Trametinib (Tafinlar+Mekinist)', subtitle:'BRAF+MEK Inhibitor Combo • Novartis', description:'Doublet blockade of MAPK pathway. Approved for BRAF V600+ melanoma, NSCLC, thyroid, CRC.', stats:[{label:'FDA',value:'2014 Melanoma'},{label:'Target',value:'BRAF V600E/K + MEK'}] } },
  { id:'DR-ERDAFITINIB',    label:'Erdafitinib',      type:'drug', val:6, color:'#00ff66', details:{ title:'Erdafitinib (Balversa)', subtitle:'Pan-FGFR Inhibitor • J&J', description:'First FGFR-targeted therapy. Approved for FGFR3-altered urothelial cancer.', stats:[{label:'FDA',value:'Apr 2019'},{label:'Target',value:'FGFR1-4'}] } },
  { id:'DR-IVOSIDENIB',     label:'Ivosidenib',       type:'drug', val:6, color:'#00ff66', details:{ title:'Ivosidenib (Tibsovo)', subtitle:'IDH1 Inhibitor • Servier', description:'Promotes differentiation of IDH1-mutant blasts. Approved in AML and cholangiocarcinoma.', stats:[{label:'FDA',value:'2018 (AML)'},{label:'Target',value:'IDH1 R132'}] } },
  { id:'DR-GILTERITINIB',   label:'Gilteritinib',     type:'drug', val:6, color:'#00ff66', details:{ title:'Gilteritinib (Xospata)', subtitle:'FLT3 Inhibitor • Astellas', description:'Approved for relapsed/refractory FLT3-ITD or TKD-mutated AML.', stats:[{label:'FDA',value:'2018'},{label:'Target',value:'FLT3-ITD/TKD'}] } },
  { id:'DR-TRASTUZUMAB',    label:'Trastuzumab',      type:'drug', val:6, color:'#00ff66', details:{ title:'Trastuzumab (Herceptin)', subtitle:'Anti-HER2 mAb • Roche/Genentech', description:'Anti-HER2 monoclonal antibody. Standard of care for HER2+ breast and gastric cancer.', stats:[{label:'FDA',value:'1998 (Breast)'},{label:'Target',value:'HER2 ECD'}] } },
  { id:'DR-TDXD',           label:'T-DXd',            type:'drug', val:6, color:'#00ff66', details:{ title:'Trastuzumab Deruxtecan (Enhertu)', subtitle:'HER2-directed ADC • Daiichi Sankyo/AZ', description:'ADC with topoisomerase I inhibitor payload. Approved HER2+ breast, gastric, NSCLC (HER2-mutated).', stats:[{label:'FDA',value:'2019'},{label:'Bystander',value:'Yes'}] } },
  { id:'DR-SELPERCATINIB',  label:'Selpercatinib',    type:'drug', val:6, color:'#00ff66', details:{ title:'Selpercatinib (Retevmo)', subtitle:'Selective RET Inhibitor • Eli Lilly', description:'Highly potent and selective RET inhibitor. Effective in RET fusion NSCLC and RET-altered thyroid cancers.', stats:[{label:'FDA',value:'2020'},{label:'Target',value:'RET fusions/mutations'}] } },
  { id:'DR-CAPMATINIB',     label:'Capmatinib',       type:'drug', val:6, color:'#00ff66', details:{ title:'Capmatinib (Tabrecta)', subtitle:'MET Inhibitor • Novartis', description:'Selective MET inhibitor. Approved for MET exon 14 skipping NSCLC.', stats:[{label:'FDA',value:'May 2020'},{label:'Target',value:'MET Exon14skip'}] } },
  { id:'DR-CETUXIMAB',      label:'Cetuximab',        type:'drug', val:6, color:'#00ff66', details:{ title:'Cetuximab (Erbitux)', subtitle:'Anti-EGFR mAb • Eli Lilly', description:'EGFR-targeted mAb for KRAS/NRAS/BRAF wild-type mCRC. Also head and neck cancer.', stats:[{label:'FDA',value:'2004 (CRC)'},{label:'Biomarker',value:'RAS/BRAF WT'}] } },
  { id:'DR-SORAFENIB',      label:'Sorafenib',        type:'drug', val:6, color:'#00ff66', details:{ title:'Sorafenib (Nexavar)', subtitle:'Multi-Kinase Inhibitor • Bayer', description:'VEGFR/PDGFR/BRAF inhibitor. First-line HCC and renal cell carcinoma.', stats:[{label:'FDA',value:'2005 (RCC), 2007 (HCC)'},{label:'Target',value:'VEGFR, BRAF, PDGFR'}] } },
  { id:'DR-ENZALUTAMIDE',   label:'Enzalutamide',     type:'drug', val:6, color:'#00ff66', details:{ title:'Enzalutamide (Xtandi)', subtitle:'Androgen Receptor Inhibitor • Pfizer/Astellas', description:'Second-generation AR signalling inhibitor. Approved for mCRPC and mCSPC.', stats:[{label:'FDA',value:'2012 (mCRPC)'},{label:'Target',value:'Androgen Receptor'}] } },
];

const TRIAL_NODES: OncologyNode[] = [
  { id:'TR-SOLAR-1',   label:'SOLAR-1 Trial',    type:'trial', val:5, color:'#0084ff', details:{ title:'NCT03868696: SOLAR-1 Phase III', subtitle:'Phase III • Completed', description:'Alpelisib + Fulvestrant vs Placebo in HR+/HER2-/PIK3CA-mut breast cancer.', stats:[{label:'PFS',value:'11.0 vs 5.7 mo'},{label:'Biomarker',value:'PIK3CA mutation'}] } },
  { id:'TR-FLAURA',    label:'FLAURA Trial',      type:'trial', val:5, color:'#0084ff', details:{ title:'NCT02296138: FLAURA Phase III', subtitle:'Phase III • Completed', description:'Osimertinib vs standard TKI as first-line in EGFR+ NSCLC.', stats:[{label:'OS',value:'38.6 vs 31.8 mo'},{label:'PFS',value:'18.9 vs 10.2 mo'}] } },
  { id:'TR-CODEBREAK', label:'CodeBreaK 200',     type:'trial', val:5, color:'#0084ff', details:{ title:'NCT03600883: CodeBreaK 200 Phase III', subtitle:'Phase III • Completed', description:'Sotorasib vs Docetaxel in KRAS G12C NSCLC post platinum/ICI.', stats:[{label:'ORR',value:'28.1% vs 13.2%'},{label:'N',value:'345'}] } },
  { id:'TR-KRYSTAL',   label:'KRYSTAL-1 Trial',   type:'trial', val:5, color:'#0084ff', details:{ title:'NCT03785249: KRYSTAL-1 Phase I/II', subtitle:'Phase I/II • Active', description:'Adagrasib in KRAS G12C solid tumors. CNS activity demonstrated.', stats:[{label:'ORR (NSCLC)',value:'43%'},{label:'CNS ORR',value:'42%'}] } },
  { id:'TR-ALEX',      label:'ALEX Trial',        type:'trial', val:5, color:'#0084ff', details:{ title:'NCT02075840: ALEX Phase III', subtitle:'Phase III • Completed', description:'Alectinib vs Crizotinib first-line ALK+ NSCLC.', stats:[{label:'PFS',value:'34.8 vs 10.9 mo (HR 0.43)'},{label:'CNS',value:'Superior'}] } },
  { id:'TR-CROWN',     label:'CROWN Trial',       type:'trial', val:5, color:'#0084ff', details:{ title:'NCT03052608: CROWN Phase III', subtitle:'Phase III • Completed', description:'Lorlatinib vs Crizotinib first-line ALK+ NSCLC.', stats:[{label:'PFS (24mo)',value:'64% vs 19%'},{label:'CNS',value:'Excellent'}] } },
  { id:'TR-COMBI-D',   label:'COMBI-d Trial',     type:'trial', val:5, color:'#0084ff', details:{ title:'NCT01584648: COMBI-d Phase III', subtitle:'Phase III • Completed', description:'Dabrafenib + Trametinib vs Dabrafenib alone in BRAF V600E/K melanoma.', stats:[{label:'mPFS',value:'11.0 vs 8.8 mo'},{label:'OS',value:'25.1 vs 18.7 mo'}] } },
  { id:'TR-BLC2001',   label:'BLC2001 Trial',     type:'trial', val:5, color:'#0084ff', details:{ title:'NCT02925533: BLC2001 Phase II', subtitle:'Phase II • Completed', description:'Erdafitinib in FGFR3/2-altered urothelial cancer post platinum chemotherapy.', stats:[{label:'ORR',value:'32.2%'},{label:'DCR',value:'63.3%'}] } },
  { id:'TR-QUAZAR',    label:'QUAZAR AML-001',    type:'trial', val:5, color:'#0084ff', details:{ title:'NCT01757535: QUAZAR AML-001 Phase III', subtitle:'Phase III • Completed', description:'Oral azacitidine maintenance in AML in remission.', stats:[{label:'OS',value:'24.7 vs 14.8 mo'},{label:'Setting',value:'AML post-CR1'}] } },
  { id:'TR-PAOLA',     label:'PAOLA-1 Trial',     type:'trial', val:5, color:'#0084ff', details:{ title:'NCT02477644: PAOLA-1 Phase III', subtitle:'Phase III • Completed', description:'Olaparib + Bevacizumab maintenance in ovarian cancer.', stats:[{label:'PFS (HRD+)',value:'37.2 vs 17.7 mo'},{label:'Setting',value:'Ovarian 1L Maintenance'}] } },
  { id:'TR-KEYNOTE189', label:'KEYNOTE-189',      type:'trial', val:5, color:'#0084ff', details:{ title:'NCT02578680: KEYNOTE-189 Phase III', subtitle:'Phase III • Completed', description:'Pembrolizumab + Chemo vs Chemo alone in non-squamous NSCLC.', stats:[{label:'OS HR',value:'0.49 (all-comers)'},{label:'Setting',value:'NSCLC 1L'}] } },
  { id:'TR-CHECKMATE', label:'CheckMate 067',     type:'trial', val:5, color:'#0084ff', details:{ title:'NCT01844505: CheckMate 067 Phase III', subtitle:'Phase III • Completed', description:'Nivolumab + Ipilimumab vs Nivolumab or Ipilimumab alone in melanoma.', stats:[{label:'5yr OS',value:'52% (combo)'},{label:'Setting',value:'Melanoma 1L'}] } },
  { id:'TR-DESTINY',   label:'DESTINY-Breast04',  type:'trial', val:5, color:'#0084ff', details:{ title:'NCT03734029: DESTINY-Breast04 Phase III', subtitle:'Phase III • Completed', description:'T-DXd vs TPC in HER2-low advanced breast cancer.', stats:[{label:'PFS (HR+)',value:'10.1 vs 5.4 mo'},{label:'Population',value:'HER2-low'}] } },
  { id:'TR-LIBRETTO',  label:'LIBRETTO-001',      type:'trial', val:5, color:'#0084ff', details:{ title:'NCT03157128: LIBRETTO-001 Phase I/II', subtitle:'Phase I/II • Active', description:'Selpercatinib in RET fusion/mutation positive solid tumors.', stats:[{label:'ORR (RET+ NSCLC)',value:'64%'},{label:'Duration',value:'17.5 mo'}] } },
  { id:'TR-GEOMETRY',  label:'GEOMETRY mono-1',   type:'trial', val:5, color:'#0084ff', details:{ title:'NCT02414139: GEOMETRY mono-1 Phase II', subtitle:'Phase II • Completed', description:'Capmatinib in MET exon 14 skipping NSCLC.', stats:[{label:'ORR (1L)',value:'68%'},{label:'ORR (2L)',value:'41%'}] } },
  { id:'TR-PRIME',     label:'PRIME Trial',       type:'trial', val:5, color:'#0084ff', details:{ title:'NCT00364013: PRIME Phase III', subtitle:'Phase III • Completed', description:'Panitumumab + FOLFOX4 in RAS WT mCRC first-line.', stats:[{label:'PFS (RAS WT)',value:'10.1 vs 7.9 mo'},{label:'Setting',value:'mCRC 1L RAS-WT'}] } },
];

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT GENERATOR — 100 patients
// ─────────────────────────────────────────────────────────────────────────────

type PatientConfig = {
  id: string; gender: 'Male'|'Female'; age: number;
  cancerId: string; cancerLabel: string;
  stage: string; histology: string; site: string;
  mutations: string[]; biomarkers: string[]; drugs: string[]; trials: string[];
  stats: {label:string;value:string|number}[];
};

const PATIENTS_CONFIG: PatientConfig[] = [
  // ── BREAST CANCER (15 patients) ──
  { id:'PT-101', gender:'Female', age:45, cancerId:'CA-BREAST', cancerLabel:'Breast Cancer', stage:'Stage IV (Metastatic)', histology:'Invasive Ductal Carcinoma', site:'Breast (Left)', mutations:['VAR-PIK3CA-H1047R','VAR-TP53-R273H'], biomarkers:['BIO-ER-POS','BIO-PR-POS','BIO-HER2-NEG'], drugs:['DR-ALPELISIB'], trials:['TR-SOLAR-1'], stats:[{label:'Mutations',value:2},{label:'Biomarkers',value:3},{label:'Therapies',value:'2 approved'}] },
  { id:'PT-102', gender:'Female', age:52, cancerId:'CA-BREAST', cancerLabel:'Breast Cancer', stage:'Stage III', histology:'Lobular Carcinoma', site:'Breast (Right)', mutations:['VAR-PIK3CA-E545K'], biomarkers:['BIO-ER-POS','BIO-HER2-NEG'], drugs:['DR-ALPELISIB'], trials:['TR-SOLAR-1'], stats:[{label:'PIK3CA',value:'E545K'},{label:'HR Status',value:'ER+/HER2-'}] },
  { id:'PT-103', gender:'Female', age:38, cancerId:'CA-BREAST', cancerLabel:'Breast Cancer', stage:'Stage IV', histology:'Triple Negative (TNBC)', site:'Breast (Bilateral)', mutations:['VAR-BRCA1-5266','VAR-TP53-R175H'], biomarkers:['BIO-HRD-POS'], drugs:['DR-OLAPARIB'], trials:['TR-PAOLA'], stats:[{label:'BRCA1',value:'Germline'},{label:'HRD',value:'Positive'}] },
  { id:'PT-104', gender:'Female', age:61, cancerId:'CA-BREAST', cancerLabel:'Breast Cancer', stage:'Stage II', histology:'IDC — HER2 Positive', site:'Breast (Left)', mutations:['VAR-HER2-AMP','VAR-TP53-Y220C'], biomarkers:['BIO-HER2-POS'], drugs:['DR-TRASTUZUMAB','DR-TDXD'], trials:['TR-DESTINY'], stats:[{label:'HER2',value:'3+ IHC / FISH+'},{label:'Drug',value:'T-DXd'}] },
  { id:'PT-105', gender:'Female', age:47, cancerId:'CA-BREAST', cancerLabel:'Breast Cancer', stage:'Stage IV', histology:'IDC — HER2-Low', site:'Breast (Right)', mutations:['VAR-PIK3CA-H1047R'], biomarkers:['BIO-ER-POS','BIO-PR-POS'], drugs:['DR-ALPELISIB','DR-TDXD'], trials:['TR-DESTINY'], stats:[{label:'HER2',value:'IHC 2+/FISH-'},{label:'PIK3CA',value:'H1047R'}] },
  { id:'PT-106', gender:'Female', age:55, cancerId:'CA-BREAST', cancerLabel:'Breast Cancer', stage:'Stage IIIB', histology:'Inflammatory Breast Cancer', site:'Breast (Left)', mutations:['VAR-TP53-R175H','VAR-PTEN-LOSS'], biomarkers:['BIO-HER2-NEG','BIO-TMB-HIGH'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'IBC',value:'Yes'},{label:'TMB',value:'High'}] },
  { id:'PT-107', gender:'Female', age:42, cancerId:'CA-BREAST', cancerLabel:'Breast Cancer', stage:'Stage IV', histology:'TNBC', site:'Breast (Right)', mutations:['VAR-BRCA2-6174','VAR-TP53-Y220C'], biomarkers:['BIO-HRD-POS','BIO-PDL1-LOW'], drugs:['DR-OLAPARIB','DR-PEMBROLIZUMAB'], trials:['TR-PAOLA'], stats:[{label:'BRCA2',value:'Germline 6174delT'},{label:'PDL1',value:'Low'}] },
  { id:'PT-108', gender:'Female', age:67, cancerId:'CA-BREAST', cancerLabel:'Breast Cancer', stage:'Stage IV', histology:'Metaplastic Carcinoma', site:'Breast (Left)', mutations:['VAR-PIK3CA-E545K','VAR-TP53-R273H'], biomarkers:['BIO-ER-POS'], drugs:['DR-ALPELISIB'], trials:['TR-SOLAR-1'], stats:[{label:'Subtype',value:'Metaplastic'},{label:'PIK3CA',value:'E545K'}] },
  { id:'PT-109', gender:'Female', age:33, cancerId:'CA-BREAST', cancerLabel:'Breast Cancer', stage:'Stage IIB', histology:'IDC — BRCA1 Germline', site:'Breast (Right)', mutations:['VAR-BRCA1-5266'], biomarkers:['BIO-HRD-POS'], drugs:['DR-OLAPARIB','DR-NIRAPARIB'], trials:['TR-PAOLA'], stats:[{label:'BRCA1',value:'Germline'},{label:'Age',value:'Young onset'}] },
  { id:'PT-110', gender:'Female', age:59, cancerId:'CA-BREAST', cancerLabel:'Breast Cancer', stage:'Stage IV', histology:'IDC — HR+', site:'Breast (Bilateral)', mutations:['VAR-PIK3CA-H1047R','VAR-PTEN-LOSS'], biomarkers:['BIO-ER-POS','BIO-HER2-NEG'], drugs:['DR-ALPELISIB'], trials:['TR-SOLAR-1'], stats:[{label:'PIK3CA',value:'H1047R'},{label:'PTEN',value:'Loss'}] },
  { id:'PT-111', gender:'Male',   age:58, cancerId:'CA-BREAST', cancerLabel:'Breast Cancer', stage:'Stage IV', histology:'IDC — Male Breast Cancer', site:'Breast', mutations:['VAR-BRCA2-6174','VAR-PIK3CA-E545K'], biomarkers:['BIO-ER-POS','BIO-HRD-POS'], drugs:['DR-OLAPARIB'], trials:['TR-PAOLA'], stats:[{label:'Male BC',value:'Rare'},{label:'BRCA2',value:'Germline'}] },
  { id:'PT-112', gender:'Female', age:50, cancerId:'CA-BREAST', cancerLabel:'Breast Cancer', stage:'Stage III', histology:'IDC — HER2+', site:'Breast (Left)', mutations:['VAR-HER2-AMP'], biomarkers:['BIO-HER2-POS','BIO-PDL1-LOW'], drugs:['DR-TRASTUZUMAB'], trials:['TR-DESTINY'], stats:[{label:'HER2',value:'Amplified'},{label:'Setting',value:'Neoadjuvant'}] },
  { id:'PT-113', gender:'Female', age:44, cancerId:'CA-BREAST', cancerLabel:'Breast Cancer', stage:'Stage IV', histology:'TNBC — PTEN Loss', site:'Breast (Right)', mutations:['VAR-PTEN-LOSS','VAR-TP53-Y220C'], biomarkers:['BIO-TMB-HIGH'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'PTEN',value:'Deleted'},{label:'Subtype',value:'TNBC'}] },
  { id:'PT-114', gender:'Female', age:71, cancerId:'CA-BREAST', cancerLabel:'Breast Cancer', stage:'Stage IV', histology:'Luminal A', site:'Breast (Left)', mutations:['VAR-PIK3CA-H1047R'], biomarkers:['BIO-ER-POS','BIO-PR-POS','BIO-HER2-NEG'], drugs:['DR-ALPELISIB'], trials:['TR-SOLAR-1'], stats:[{label:'Subtype',value:'Luminal A'},{label:'Grade',value:'Low'}] },
  { id:'PT-115', gender:'Female', age:40, cancerId:'CA-BREAST', cancerLabel:'Breast Cancer', stage:'Stage IIB', histology:'IDC — BRCA2', site:'Breast (Right)', mutations:['VAR-BRCA2-6174','VAR-TP53-R175H'], biomarkers:['BIO-HRD-POS'], drugs:['DR-OLAPARIB'], trials:['TR-PAOLA'], stats:[{label:'BRCA2',value:'Germline'},{label:'HRD',value:'Positive'}] },

  // ── NSCLC (15 patients) ──
  { id:'PT-116', gender:'Male',   age:62, cancerId:'CA-NSCLC', cancerLabel:'NSCLC', stage:'Stage IIIB', histology:'Adenocarcinoma', site:'Lung (Right Upper Lobe)', mutations:['VAR-EGFR-L858R','VAR-TP53-R273H'], biomarkers:['BIO-PDL1-LOW'], drugs:['DR-OSIMERTINIB'], trials:['TR-FLAURA'], stats:[{label:'EGFR',value:'L858R'},{label:'TKI',value:'Osimertinib'}] },
  { id:'PT-117', gender:'Female', age:48, cancerId:'CA-NSCLC', cancerLabel:'NSCLC', stage:'Stage IV', histology:'Adenocarcinoma — EGFR+', site:'Lung (Left)', mutations:['VAR-EGFR-DEL19','VAR-EGFR-T790M'], biomarkers:['BIO-PDL1-LOW'], drugs:['DR-OSIMERTINIB'], trials:['TR-FLAURA'], stats:[{label:'EGFR',value:'Del19 + T790M'},{label:'Setting',value:'Acquired resistance'}] },
  { id:'PT-118', gender:'Female', age:58, cancerId:'CA-NSCLC', cancerLabel:'NSCLC', stage:'Stage IV', histology:'Squamous Cell Carcinoma', site:'Lung (Left Lower Lobe)', mutations:['VAR-KRAS-G12C'], biomarkers:['BIO-PDL1-HIGH'], drugs:['DR-SOTORASIB'], trials:['TR-CODEBREAK'], stats:[{label:'KRAS',value:'G12C'},{label:'PDL1',value:'High'}] },
  { id:'PT-119', gender:'Male',   age:41, cancerId:'CA-NSCLC', cancerLabel:'NSCLC', stage:'Stage IV', histology:'Adenocarcinoma — ALK+', site:'Lung (Right Lower Lobe)', mutations:['VAR-ALK-FUSION'], biomarkers:['BIO-PDL1-LOW'], drugs:['DR-ALECTINIB'], trials:['TR-ALEX'], stats:[{label:'ALK',value:'EML4-ALK Fusion'},{label:'CNS',value:'Metastases'}] },
  { id:'PT-120', gender:'Male',   age:55, cancerId:'CA-NSCLC', cancerLabel:'NSCLC', stage:'Stage IV', histology:'Adenocarcinoma — KRAS G12D', site:'Lung (Right)', mutations:['VAR-KRAS-G12D','VAR-TP53-Y220C'], biomarkers:['BIO-TMB-HIGH'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'KRAS',value:'G12D'},{label:'TMB',value:'High'}] },
  { id:'PT-121', gender:'Female', age:36, cancerId:'CA-NSCLC', cancerLabel:'NSCLC', stage:'Stage IIIA', histology:'Adenocarcinoma — ROS1+', site:'Lung (Left)', mutations:['VAR-ROS1-FUSION'], biomarkers:['BIO-PDL1-LOW'], drugs:['DR-LORLATINIB'], trials:['TR-CROWN'], stats:[{label:'ROS1',value:'Fusion+'},{label:'Drug',value:'Lorlatinib'}] },
  { id:'PT-122', gender:'Male',   age:70, cancerId:'CA-NSCLC', cancerLabel:'NSCLC', stage:'Stage IV', histology:'Squamous — PDL1 High', site:'Lung (Right)', mutations:['VAR-TP53-R273H'], biomarkers:['BIO-PDL1-HIGH','BIO-TMB-HIGH'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'PDL1',value:'80% TPS'},{label:'Drug',value:'Pembrolizumab 1L'}] },
  { id:'PT-123', gender:'Male',   age:53, cancerId:'CA-NSCLC', cancerLabel:'NSCLC', stage:'Stage IV', histology:'Adenocarcinoma — MET Exon14', site:'Lung (Left Upper Lobe)', mutations:['VAR-MET-EX14'], biomarkers:['BIO-PDL1-LOW'], drugs:['DR-CAPMATINIB'], trials:['TR-GEOMETRY'], stats:[{label:'MET',value:'Exon14 Skip'},{label:'Drug',value:'Capmatinib'}] },
  { id:'PT-124', gender:'Female', age:44, cancerId:'CA-NSCLC', cancerLabel:'NSCLC', stage:'Stage IV', histology:'Adenocarcinoma — RET Fusion', site:'Lung (Right)', mutations:['VAR-RET-FUSION'], biomarkers:['BIO-PDL1-LOW'], drugs:['DR-SELPERCATINIB'], trials:['TR-LIBRETTO'], stats:[{label:'RET',value:'KIF5B-RET'},{label:'Drug',value:'Selpercatinib'}] },
  { id:'PT-125', gender:'Male',   age:64, cancerId:'CA-NSCLC', cancerLabel:'NSCLC', stage:'Stage IIIB', histology:'Adenocarcinoma — KRAS G12C', site:'Lung (Right Upper Lobe)', mutations:['VAR-KRAS-G12C','VAR-TP53-R273H'], biomarkers:['BIO-PDL1-LOW'], drugs:['DR-ADAGRASIB'], trials:['TR-KRYSTAL'], stats:[{label:'KRAS',value:'G12C'},{label:'Drug',value:'Adagrasib'}] },
  { id:'PT-126', gender:'Female', age:39, cancerId:'CA-NSCLC', cancerLabel:'NSCLC', stage:'Stage IV', histology:'Adenocarcinoma — ALK+', site:'Lung (Left)', mutations:['VAR-ALK-FUSION','VAR-TP53-Y220C'], biomarkers:['BIO-PDL1-LOW'], drugs:['DR-LORLATINIB'], trials:['TR-CROWN'], stats:[{label:'ALK',value:'EML4-ALK'},{label:'Setting',value:'Lorlatinib 1L'}] },
  { id:'PT-127', gender:'Male',   age:72, cancerId:'CA-NSCLC', cancerLabel:'NSCLC', stage:'Stage IV', histology:'Large Cell Carcinoma', site:'Lung (Bilateral)', mutations:['VAR-KRAS-G12V','VAR-CDKN2A-DEL'], biomarkers:['BIO-TMB-HIGH'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'KRAS',value:'G12V'},{label:'TMB',value:'High'}] },
  { id:'PT-128', gender:'Female', age:46, cancerId:'CA-NSCLC', cancerLabel:'NSCLC', stage:'Stage IV', histology:'Adenocarcinoma — EGFR L858R', site:'Lung (Right)', mutations:['VAR-EGFR-L858R'], biomarkers:['BIO-PDL1-LOW'], drugs:['DR-OSIMERTINIB'], trials:['TR-FLAURA'], stats:[{label:'EGFR',value:'L858R'},{label:'Never smoker',value:'Yes'}] },
  { id:'PT-129', gender:'Male',   age:60, cancerId:'CA-NSCLC', cancerLabel:'NSCLC', stage:'Stage IIIA', histology:'Squamous — BRAF V600E', site:'Lung (Right)', mutations:['VAR-BRAF-V600E','VAR-TP53-R175H'], biomarkers:['BIO-BRAF-POS','BIO-TMB-HIGH'], drugs:['DR-DABRAFENIB'], trials:['TR-COMBI-D'], stats:[{label:'BRAF',value:'V600E'},{label:'Drug',value:'Dabrafenib+Tram'}] },
  { id:'PT-130', gender:'Male',   age:49, cancerId:'CA-NSCLC', cancerLabel:'NSCLC', stage:'Stage IV', histology:'Adenocarcinoma — MSI-H', site:'Lung (Left)', mutations:['VAR-TP53-R273H'], biomarkers:['BIO-MSI-H','BIO-TMB-HIGH'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'MSI',value:'MSI-High'},{label:'Drug',value:'Pembrolizumab'}] },

  // ── OVARIAN CANCER (10 patients) ──
  { id:'PT-131', gender:'Female', age:50, cancerId:'CA-OVARIAN', cancerLabel:'Ovarian Cancer', stage:'Stage IIIC', histology:'High-Grade Serous (HGSOC)', site:'Ovary (Bilateral)', mutations:['VAR-BRCA1-5266','VAR-TP53-R175H'], biomarkers:['BIO-HRD-POS','BIO-CA125'], drugs:['DR-OLAPARIB'], trials:['TR-PAOLA'], stats:[{label:'BRCA1',value:'Germline'},{label:'HRD',value:'Positive'}] },
  { id:'PT-132', gender:'Female', age:63, cancerId:'CA-OVARIAN', cancerLabel:'Ovarian Cancer', stage:'Stage IV', histology:'HGSOC — BRCA2', site:'Ovary (Right)', mutations:['VAR-BRCA2-6174'], biomarkers:['BIO-HRD-POS','BIO-CA125'], drugs:['DR-NIRAPARIB','DR-OLAPARIB'], trials:['TR-PAOLA'], stats:[{label:'BRCA2',value:'Germline'},{label:'Platinum',value:'Sensitive'}] },
  { id:'PT-133', gender:'Female', age:55, cancerId:'CA-OVARIAN', cancerLabel:'Ovarian Cancer', stage:'Stage IIIB', histology:'Clear Cell Carcinoma', site:'Ovary (Left)', mutations:['VAR-PIK3CA-H1047R','VAR-TP53-Y220C'], biomarkers:['BIO-MSI-H'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'Subtype',value:'Clear Cell'},{label:'MSI',value:'MSI-High'}] },
  { id:'PT-134', gender:'Female', age:48, cancerId:'CA-OVARIAN', cancerLabel:'Ovarian Cancer', stage:'Stage IV', histology:'HGSOC — HRD+', site:'Ovary (Bilateral)', mutations:['VAR-BRCA1-5266'], biomarkers:['BIO-HRD-POS','BIO-CA125'], drugs:['DR-NIRAPARIB'], trials:['TR-PAOLA'], stats:[{label:'BRCA1',value:'Somatic'},{label:'Maintenance',value:'Niraparib'}] },
  { id:'PT-135', gender:'Female', age:58, cancerId:'CA-OVARIAN', cancerLabel:'Ovarian Cancer', stage:'Stage IIIC', histology:'Endometrioid Ovarian Ca.', site:'Ovary (Right)', mutations:['VAR-PTEN-LOSS','VAR-PIK3CA-E545K'], biomarkers:['BIO-MSI-H'], drugs:['DR-PEMBROLIZUMAB','DR-ALPELISIB'], trials:['TR-KEYNOTE189'], stats:[{label:'Subtype',value:'Endometrioid'},{label:'MSI',value:'High'}] },
  { id:'PT-136', gender:'Female', age:44, cancerId:'CA-OVARIAN', cancerLabel:'Ovarian Cancer', stage:'Stage IV', histology:'HGSOC', site:'Ovary (Bilateral)', mutations:['VAR-BRCA2-6174','VAR-TP53-R273H'], biomarkers:['BIO-HRD-POS'], drugs:['DR-OLAPARIB'], trials:['TR-PAOLA'], stats:[{label:'Platinum',value:'Sensitive'},{label:'HRD',value:'Positive'}] },
  { id:'PT-137', gender:'Female', age:70, cancerId:'CA-OVARIAN', cancerLabel:'Ovarian Cancer', stage:'Stage IIIC', histology:'HGSOC — Recurrent', site:'Ovary (Bilateral)', mutations:['VAR-TP53-R175H'], biomarkers:['BIO-CA125','BIO-HRD-POS'], drugs:['DR-NIRAPARIB'], trials:['TR-PAOLA'], stats:[{label:'Setting',value:'Recurrent Ovarian'},{label:'Prior Tx',value:'Carboplatin-Paclitaxel'}] },
  { id:'PT-138', gender:'Female', age:52, cancerId:'CA-OVARIAN', cancerLabel:'Ovarian Cancer', stage:'Stage IIIA', histology:'Mucinous Ovarian Ca.', site:'Ovary (Right)', mutations:['VAR-KRAS-G12D','VAR-TP53-Y220C'], biomarkers:['BIO-CEA'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'Subtype',value:'Mucinous'},{label:'KRAS',value:'G12D'}] },
  { id:'PT-139', gender:'Female', age:39, cancerId:'CA-OVARIAN', cancerLabel:'Ovarian Cancer', stage:'Stage IV', histology:'HGSOC — BRCA1', site:'Ovary (Bilateral)', mutations:['VAR-BRCA1-5266','VAR-TP53-R175H'], biomarkers:['BIO-HRD-POS','BIO-CA125'], drugs:['DR-OLAPARIB','DR-NIRAPARIB'], trials:['TR-PAOLA'], stats:[{label:'Age',value:'Young onset'},{label:'BRCA1',value:'Germline'}] },
  { id:'PT-140', gender:'Female', age:65, cancerId:'CA-OVARIAN', cancerLabel:'Ovarian Cancer', stage:'Stage IV', histology:'HGSOC — Recurrent platinum-resistant', site:'Ovary (Bilateral)', mutations:['VAR-BRCA2-6174'], biomarkers:['BIO-HRD-POS'], drugs:['DR-NIRAPARIB'], trials:['TR-PAOLA'], stats:[{label:'Platinum',value:'Resistant'},{label:'HRD',value:'Positive'}] },

  // ── COLORECTAL CANCER (8 patients) ──
  { id:'PT-141', gender:'Male',   age:67, cancerId:'CA-COLORECTAL', cancerLabel:'Colorectal Cancer', stage:'Stage IV', histology:'Adenocarcinoma — KRAS G12D', site:'Colon (Sigmoid)', mutations:['VAR-KRAS-G12D','VAR-PIK3CA-E545K'], biomarkers:['BIO-CEA'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'KRAS',value:'G12D'},{label:'PIK3CA',value:'E545K'}] },
  { id:'PT-142', gender:'Female', age:55, cancerId:'CA-COLORECTAL', cancerLabel:'Colorectal Cancer', stage:'Stage IV', histology:'Adenocarcinoma — MSI-H', site:'Colon (Ascending)', mutations:['VAR-TP53-R273H'], biomarkers:['BIO-MSI-H','BIO-TMB-HIGH'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'MSI',value:'MSI-High'},{label:'Drug',value:'Pembrolizumab 1L'}] },
  { id:'PT-143', gender:'Male',   age:72, cancerId:'CA-COLORECTAL', cancerLabel:'Colorectal Cancer', stage:'Stage III', histology:'Rectal Adenocarcinoma — BRAF V600E', site:'Rectum', mutations:['VAR-BRAF-V600E','VAR-TP53-Y220C'], biomarkers:['BIO-BRAF-POS','BIO-CEA'], drugs:['DR-DABRAFENIB','DR-CETUXIMAB'], trials:['TR-PRIME'], stats:[{label:'BRAF',value:'V600E'},{label:'Drug',value:'Dabrafenib+Tram+Cetuximab'}] },
  { id:'PT-144', gender:'Female', age:48, cancerId:'CA-COLORECTAL', cancerLabel:'Colorectal Cancer', stage:'Stage IV', histology:'Adenocarcinoma — RAS WT', site:'Colon (Descending)', mutations:['VAR-TP53-R175H'], biomarkers:['BIO-KRAS-WT','BIO-CEA'], drugs:['DR-CETUXIMAB'], trials:['TR-PRIME'], stats:[{label:'RAS',value:'Wild-Type'},{label:'Drug',value:'Cetuximab'}] },
  { id:'PT-145', gender:'Male',   age:60, cancerId:'CA-COLORECTAL', cancerLabel:'Colorectal Cancer', stage:'Stage IV', histology:'Adenocarcinoma — KRAS G12V', site:'Colon (Transverse)', mutations:['VAR-KRAS-G12V','VAR-APC-MUT'], biomarkers:['BIO-CEA'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'KRAS',value:'G12V'},{label:'APC',value:'Mutated'}] },
  { id:'PT-146', gender:'Female', age:44, cancerId:'CA-COLORECTAL', cancerLabel:'Colorectal Cancer', stage:'Stage IIB', histology:'Mucinous Adenocarcinoma', site:'Colon (Ascending)', mutations:['VAR-KRAS-G12D','VAR-PTEN-LOSS'], biomarkers:['BIO-MSI-H'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'Subtype',value:'Mucinous'},{label:'MSI',value:'High'}] },
  { id:'PT-147', gender:'Male',   age:76, cancerId:'CA-COLORECTAL', cancerLabel:'Colorectal Cancer', stage:'Stage IV', histology:'Rectal Cancer — RAS WT', site:'Rectum', mutations:['VAR-TP53-R273H'], biomarkers:['BIO-KRAS-WT','BIO-CEA'], drugs:['DR-CETUXIMAB'], trials:['TR-PRIME'], stats:[{label:'RAS',value:'Wild-Type'},{label:'Left-Sided',value:'Yes'}] },
  { id:'PT-148', gender:'Female', age:53, cancerId:'CA-COLORECTAL', cancerLabel:'Colorectal Cancer', stage:'Stage III', histology:'Adenocarcinoma — PIK3CA', site:'Colon (Sigmoid)', mutations:['VAR-PIK3CA-H1047R','VAR-TP53-Y220C'], biomarkers:['BIO-CEA'], drugs:['DR-ALPELISIB'], trials:['TR-SOLAR-1'], stats:[{label:'PIK3CA',value:'H1047R'},{label:'APC',value:'WT'}] },

  // ── PROSTATE CANCER (8 patients) ──
  { id:'PT-149', gender:'Male',   age:68, cancerId:'CA-PROSTATE', cancerLabel:'Prostate Cancer', stage:'mCRPC', histology:'Adenocarcinoma', site:'Prostate', mutations:['VAR-BRCA2-6174','VAR-TP53-R273H'], biomarkers:['BIO-HRD-POS','BIO-PSA-HIGH'], drugs:['DR-OLAPARIB','DR-ENZALUTAMIDE'], trials:['TR-PAOLA'], stats:[{label:'BRCA2',value:'Germline'},{label:'PSA',value:'Elevated'}] },
  { id:'PT-150', gender:'Male',   age:73, cancerId:'CA-PROSTATE', cancerLabel:'Prostate Cancer', stage:'Stage IV mCSPC', histology:'Adenocarcinoma', site:'Prostate (+ Bone Mets)', mutations:['VAR-TP53-R175H'], biomarkers:['BIO-PSA-HIGH'], drugs:['DR-ENZALUTAMIDE'], trials:['TR-KEYNOTE189'], stats:[{label:'Mets',value:'Bone + LN'},{label:'Drug',value:'Enzalutamide'}] },
  { id:'PT-151', gender:'Male',   age:65, cancerId:'CA-PROSTATE', cancerLabel:'Prostate Cancer', stage:'mCRPC', histology:'Adenocarcinoma — BRCA1', site:'Prostate', mutations:['VAR-BRCA1-5266'], biomarkers:['BIO-HRD-POS','BIO-PSA-HIGH'], drugs:['DR-OLAPARIB'], trials:['TR-PAOLA'], stats:[{label:'BRCA1',value:'Somatic'},{label:'HRD',value:'Positive'}] },
  { id:'PT-152', gender:'Male',   age:78, cancerId:'CA-PROSTATE', cancerLabel:'Prostate Cancer', stage:'mCRPC', histology:'Adenocarcinoma — AR-V7', site:'Prostate', mutations:['VAR-TP53-Y220C','VAR-PTEN-LOSS'], biomarkers:['BIO-PSA-HIGH'], drugs:['DR-ENZALUTAMIDE'], trials:['TR-KEYNOTE189'], stats:[{label:'AR-V7',value:'Positive'},{label:'PTEN',value:'Loss'}] },
  { id:'PT-153', gender:'Male',   age:60, cancerId:'CA-PROSTATE', cancerLabel:'Prostate Cancer', stage:'Stage IV', histology:'Adenocarcinoma — MSI-H', site:'Prostate (+ LN)', mutations:['VAR-TP53-R273H'], biomarkers:['BIO-MSI-H','BIO-PSA-HIGH'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'MSI',value:'MSI-High'},{label:'Drug',value:'Pembrolizumab'}] },
  { id:'PT-154', gender:'Male',   age:66, cancerId:'CA-PROSTATE', cancerLabel:'Prostate Cancer', stage:'mCRPC', histology:'Adenocarcinoma — ATM Loss', site:'Prostate', mutations:['VAR-ATM-MUT','VAR-TP53-R175H'], biomarkers:['BIO-HRD-POS'], drugs:['DR-OLAPARIB'], trials:['TR-PAOLA'], stats:[{label:'ATM',value:'Biallelic loss'},{label:'HRD',value:'Positive'}] },
  { id:'PT-155', gender:'Male',   age:71, cancerId:'CA-PROSTATE', cancerLabel:'Prostate Cancer', stage:'mCRPC', histology:'Adenocarcinoma', site:'Prostate', mutations:['VAR-BRCA2-6174'], biomarkers:['BIO-PSA-HIGH','BIO-HRD-POS'], drugs:['DR-OLAPARIB','DR-ENZALUTAMIDE'], trials:['TR-PAOLA'], stats:[{label:'BRCA2',value:'Germline'},{label:'Setting',value:'Post-Enzalutamide'}] },
  { id:'PT-156', gender:'Male',   age:58, cancerId:'CA-PROSTATE', cancerLabel:'Prostate Cancer', stage:'Stage IV', histology:'Adenocarcinoma — TMB-High', site:'Prostate', mutations:['VAR-PTEN-LOSS','VAR-TP53-Y220C'], biomarkers:['BIO-TMB-HIGH','BIO-PSA-HIGH'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'TMB',value:'High'},{label:'PTEN',value:'Loss'}] },

  // ── PANCREATIC CANCER (6 patients) ──
  { id:'PT-157', gender:'Male',   age:66, cancerId:'CA-PANCREATIC', cancerLabel:'Pancreatic Cancer', stage:'Stage IV', histology:'Pancreatic Ductal Adenocarcinoma (PDAC)', site:'Pancreas (Head)', mutations:['VAR-KRAS-G12D','VAR-TP53-R273H'], biomarkers:['BIO-CEA'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'KRAS',value:'G12D'},{label:'Stage',value:'Metastatic'}] },
  { id:'PT-158', gender:'Female', age:59, cancerId:'CA-PANCREATIC', cancerLabel:'Pancreatic Cancer', stage:'Stage III', histology:'PDAC — BRCA2', site:'Pancreas (Body)', mutations:['VAR-BRCA2-6174','VAR-KRAS-G12V'], biomarkers:['BIO-HRD-POS'], drugs:['DR-OLAPARIB'], trials:['TR-PAOLA'], stats:[{label:'BRCA2',value:'Germline'},{label:'Maintenance',value:'Olaparib'}] },
  { id:'PT-159', gender:'Male',   age:72, cancerId:'CA-PANCREATIC', cancerLabel:'Pancreatic Cancer', stage:'Stage IV', histology:'PDAC — KRAS G12C', site:'Pancreas (Tail)', mutations:['VAR-KRAS-G12C','VAR-TP53-Y220C'], biomarkers:['BIO-CEA'], drugs:['DR-ADAGRASIB'], trials:['TR-KRYSTAL'], stats:[{label:'KRAS',value:'G12C — rare in PDAC'},{label:'Drug',value:'Adagrasib'}] },
  { id:'PT-160', gender:'Female', age:55, cancerId:'CA-PANCREATIC', cancerLabel:'Pancreatic Cancer', stage:'Stage IV', histology:'PDAC — ATM Loss', site:'Pancreas (Head + LN)', mutations:['VAR-ATM-MUT','VAR-KRAS-G12D'], biomarkers:['BIO-HRD-POS'], drugs:['DR-OLAPARIB'], trials:['TR-PAOLA'], stats:[{label:'ATM',value:'Biallelic'},{label:'HRD',value:'Positive'}] },
  { id:'PT-161', gender:'Male',   age:63, cancerId:'CA-PANCREATIC', cancerLabel:'Pancreatic Cancer', stage:'Stage IV', histology:'PDAC — MSI-H (rare)', site:'Pancreas (Body)', mutations:['VAR-KRAS-G12D','VAR-TP53-R175H'], biomarkers:['BIO-MSI-H','BIO-CEA'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'MSI',value:'High (rare PDAC)'},{label:'Drug',value:'Pembrolizumab'}] },
  { id:'PT-162', gender:'Female', age:48, cancerId:'CA-PANCREATIC', cancerLabel:'Pancreatic Cancer', stage:'Stage III', histology:'PDAC — BRCA1', site:'Pancreas (Tail)', mutations:['VAR-BRCA1-5266','VAR-KRAS-G12V'], biomarkers:['BIO-HRD-POS'], drugs:['DR-OLAPARIB'], trials:['TR-PAOLA'], stats:[{label:'BRCA1',value:'Germline'},{label:'Resectable',value:'Borderline'}] },

  // ── MELANOMA (8 patients) ──
  { id:'PT-163', gender:'Male',   age:57, cancerId:'CA-MELANOMA', cancerLabel:'Melanoma', stage:'Stage IV', histology:'Cutaneous Melanoma — BRAF V600E', site:'Skin (Back)', mutations:['VAR-BRAF-V600E','VAR-NRAS-Q61K'], biomarkers:['BIO-BRAF-POS','BIO-TMB-HIGH'], drugs:['DR-DABRAFENIB','DR-PEMBROLIZUMAB'], trials:['TR-COMBI-D'], stats:[{label:'BRAF',value:'V600E'},{label:'TMB',value:'High'}] },
  { id:'PT-164', gender:'Female', age:42, cancerId:'CA-MELANOMA', cancerLabel:'Melanoma', stage:'Stage IIIC', histology:'Nodular Melanoma — NRAS Q61K', site:'Skin (Arm)', mutations:['VAR-NRAS-Q61K','VAR-TP53-R175H'], biomarkers:['BIO-TMB-HIGH'], drugs:['DR-NIVOLUMAB','DR-PEMBROLIZUMAB'], trials:['TR-CHECKMATE'], stats:[{label:'NRAS',value:'Q61K'},{label:'Drug',value:'Nivolumab+Ipi'}] },
  { id:'PT-165', gender:'Male',   age:68, cancerId:'CA-MELANOMA', cancerLabel:'Melanoma', stage:'Stage IV', histology:'Acral Lentiginous Melanoma', site:'Foot (Plantar)', mutations:['VAR-BRAF-V600E'], biomarkers:['BIO-BRAF-POS','BIO-PDL1-HIGH'], drugs:['DR-DABRAFENIB','DR-PEMBROLIZUMAB'], trials:['TR-COMBI-D','TR-CHECKMATE'], stats:[{label:'Subtype',value:'Acral'},{label:'BRAF',value:'V600E'}] },
  { id:'PT-166', gender:'Female', age:35, cancerId:'CA-MELANOMA', cancerLabel:'Melanoma', stage:'Stage IIIB', histology:'Superficial Spreading Melanoma', site:'Skin (Shoulder)', mutations:['VAR-BRAF-V600E','VAR-PTEN-LOSS'], biomarkers:['BIO-BRAF-POS','BIO-TMB-HIGH'], drugs:['DR-DABRAFENIB'], trials:['TR-COMBI-D'], stats:[{label:'BRAF',value:'V600E'},{label:'PTEN',value:'Loss (resistance risk)'}] },
  { id:'PT-167', gender:'Male',   age:75, cancerId:'CA-MELANOMA', cancerLabel:'Melanoma', stage:'Stage IV', histology:'Uveal Melanoma', site:'Eye (Choroid)', mutations:['VAR-NRAS-Q61K'], biomarkers:['BIO-TMB-HIGH'], drugs:['DR-NIVOLUMAB'], trials:['TR-CHECKMATE'], stats:[{label:'Subtype',value:'Uveal'},{label:'GNAQ/11',value:'Mutated'}] },
  { id:'PT-168', gender:'Female', age:51, cancerId:'CA-MELANOMA', cancerLabel:'Melanoma', stage:'Stage III', histology:'Desmoplastic Melanoma', site:'Skin (Face)', mutations:['VAR-TP53-R273H'], biomarkers:['BIO-TMB-HIGH','BIO-PDL1-HIGH'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'Subtype',value:'Desmoplastic'},{label:'TMB',value:'Very High'}] },
  { id:'PT-169', gender:'Male',   age:46, cancerId:'CA-MELANOMA', cancerLabel:'Melanoma', stage:'Stage IV', histology:'Mucosal Melanoma', site:'Nasal Mucosa', mutations:['VAR-BRAF-V600E','VAR-TP53-Y220C'], biomarkers:['BIO-PDL1-LOW'], drugs:['DR-NIVOLUMAB','DR-DABRAFENIB'], trials:['TR-CHECKMATE'], stats:[{label:'Subtype',value:'Mucosal'},{label:'BRAF',value:'V600E'}] },
  { id:'PT-170', gender:'Female', age:63, cancerId:'CA-MELANOMA', cancerLabel:'Melanoma', stage:'Stage IIIC', histology:'Nodular Melanoma — BRAF WT', site:'Skin (Leg)', mutations:['VAR-NRAS-Q61K','VAR-CDKN2A-DEL'], biomarkers:['BIO-TMB-HIGH'], drugs:['DR-NIVOLUMAB'], trials:['TR-CHECKMATE'], stats:[{label:'BRAF',value:'Wild-Type'},{label:'IO',value:'Nivolumab+Ipi'}] },

  // ── GLIOBLASTOMA (5 patients) ──
  { id:'PT-171', gender:'Male',   age:55, cancerId:'CA-GBM', cancerLabel:'Glioblastoma', stage:'Grade IV (GBM)', histology:'GBM — IDH1 Wild-Type', site:'Brain (Frontal Lobe)', mutations:['VAR-TP53-R273H','VAR-EGFR-AMP'], biomarkers:['BIO-TMB-HIGH'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'IDH1',value:'Wild-Type'},{label:'MGMT',value:'Unmethylated'}] },
  { id:'PT-172', gender:'Female', age:42, cancerId:'CA-GBM', cancerLabel:'Glioblastoma', stage:'Grade IV (GBM)', histology:'GBM — IDH1 Mutant', site:'Brain (Temporal Lobe)', mutations:['VAR-IDH1-R132H','VAR-TP53-R175H'], biomarkers:['BIO-MSI-H'], drugs:['DR-IVOSIDENIB'], trials:['TR-QUAZAR'], stats:[{label:'IDH1',value:'R132H'},{label:'MGMT',value:'Methylated'}] },
  { id:'PT-173', gender:'Male',   age:62, cancerId:'CA-GBM', cancerLabel:'Glioblastoma', stage:'Grade IV (Recurrent GBM)', histology:'GBM — EGFR Amplified', site:'Brain (Parietal)', mutations:['VAR-EGFR-L858R','VAR-PTEN-LOSS'], biomarkers:['BIO-PDL1-LOW'], drugs:['DR-OSIMERTINIB'], trials:['TR-FLAURA'], stats:[{label:'EGFR',value:'Amplified + L858R'},{label:'PTEN',value:'Loss'}] },
  { id:'PT-174', gender:'Female', age:38, cancerId:'CA-GBM', cancerLabel:'Glioblastoma', stage:'Grade III → IV', histology:'Anaplastic Astrocytoma → GBM', site:'Brain (Frontal)', mutations:['VAR-IDH1-R132H','VAR-TP53-Y220C'], biomarkers:['BIO-MSI-H'], drugs:['DR-IVOSIDENIB','DR-PEMBROLIZUMAB'], trials:['TR-QUAZAR'], stats:[{label:'IDH1',value:'R132H'},{label:'Grade',value:'Evolving'}] },
  { id:'PT-175', gender:'Male',   age:70, cancerId:'CA-GBM', cancerLabel:'Glioblastoma', stage:'Grade IV (Newly diagnosed)', histology:'GBM — MGMT Methylated', site:'Brain (Temporal)', mutations:['VAR-TP53-R173H','VAR-PTEN-LOSS'], biomarkers:['BIO-TMB-HIGH'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'MGMT',value:'Methylated (favourable)'},{label:'TMB',value:'High'}] },

  // ── BLADDER CANCER (5 patients) ──
  { id:'PT-176', gender:'Male',   age:69, cancerId:'CA-BLADDER', cancerLabel:'Bladder Cancer', stage:'Stage IV', histology:'Urothelial Carcinoma — FGFR3', site:'Bladder', mutations:['VAR-FGFR3-MUT','VAR-TP53-R273H'], biomarkers:['BIO-PDL1-LOW'], drugs:['DR-ERDAFITINIB'], trials:['TR-BLC2001'], stats:[{label:'FGFR3',value:'S249C'},{label:'Drug',value:'Erdafitinib'}] },
  { id:'PT-177', gender:'Female', age:57, cancerId:'CA-BLADDER', cancerLabel:'Bladder Cancer', stage:'Stage III', histology:'Urothelial Ca. — TMB-High', site:'Bladder', mutations:['VAR-TP53-Y220C'], biomarkers:['BIO-TMB-HIGH','BIO-PDL1-HIGH'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'TMB',value:'High'},{label:'Drug',value:'Pembrolizumab 1L'}] },
  { id:'PT-178', gender:'Male',   age:74, cancerId:'CA-BLADDER', cancerLabel:'Bladder Cancer', stage:'Stage IV', histology:'Urothelial Ca. — FGFR3 Fusion', site:'Bladder + LN', mutations:['VAR-FGFR3-MUT','VAR-PIK3CA-H1047R'], biomarkers:['BIO-PDL1-LOW'], drugs:['DR-ERDAFITINIB'], trials:['TR-BLC2001'], stats:[{label:'FGFR3',value:'Fusion'},{label:'PIK3CA',value:'Co-altered'}] },
  { id:'PT-179', gender:'Male',   age:63, cancerId:'CA-BLADDER', cancerLabel:'Bladder Cancer', stage:'Stage III', histology:'Urothelial Ca. — ERBB2 mutated', site:'Bladder', mutations:['VAR-HER2-AMP','VAR-TP53-R175H'], biomarkers:['BIO-HER2-POS'], drugs:['DR-TRASTUZUMAB','DR-TDXD'], trials:['TR-DESTINY'], stats:[{label:'HER2',value:'Mutated/Amplified'},{label:'Drug',value:'T-DXd'}] },
  { id:'PT-180', gender:'Female', age:52, cancerId:'CA-BLADDER', cancerLabel:'Bladder Cancer', stage:'Stage IV', histology:'Urothelial Ca. — MSI-H', site:'Bladder', mutations:['VAR-TP53-R273H'], biomarkers:['BIO-MSI-H','BIO-TMB-HIGH'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'MSI',value:'MSI-High'},{label:'Setting',value:'IO monotherapy'}] },

  // ── HCC (5 patients) ──
  { id:'PT-181', gender:'Male',   age:64, cancerId:'CA-HCC', cancerLabel:'Hepatocellular Ca.', stage:'BCLC-C (Advanced)', histology:'Hepatocellular Carcinoma', site:'Liver', mutations:['VAR-TP53-R273H','VAR-PTEN-LOSS'], biomarkers:['BIO-AFP-HIGH'], drugs:['DR-SORAFENIB'], trials:['TR-KEYNOTE189'], stats:[{label:'AFP',value:'>400 ng/mL'},{label:'Drug',value:'Sorafenib'}] },
  { id:'PT-182', gender:'Male',   age:58, cancerId:'CA-HCC', cancerLabel:'Hepatocellular Ca.', stage:'BCLC-B', histology:'HCC — HBV Associated', site:'Liver (Multifocal)', mutations:['VAR-TP53-R175H'], biomarkers:['BIO-AFP-HIGH','BIO-PDL1-HIGH'], drugs:['DR-NIVOLUMAB'], trials:['TR-CHECKMATE'], stats:[{label:'Etiology',value:'Hepatitis B'},{label:'PDL1',value:'High'}] },
  { id:'PT-183', gender:'Female', age:52, cancerId:'CA-HCC', cancerLabel:'Hepatocellular Ca.', stage:'BCLC-C', histology:'HCC — HCV Associated', site:'Liver', mutations:['VAR-KRAS-G12D','VAR-TP53-Y220C'], biomarkers:['BIO-AFP-HIGH'], drugs:['DR-SORAFENIB','DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'Etiology',value:'Hepatitis C'},{label:'Child-Pugh',value:'A'}] },
  { id:'PT-184', gender:'Male',   age:71, cancerId:'CA-HCC', cancerLabel:'Hepatocellular Ca.', stage:'BCLC-C', histology:'HCC — NASH Cirrhosis', site:'Liver (Right Lobe)', mutations:['VAR-TP53-R273H','VAR-PIK3CA-E545K'], biomarkers:['BIO-AFP-HIGH','BIO-TMB-HIGH'], drugs:['DR-NIVOLUMAB'], trials:['TR-CHECKMATE'], stats:[{label:'Etiology',value:'NASH'},{label:'TMB',value:'High'}] },
  { id:'PT-185', gender:'Male',   age:47, cancerId:'CA-HCC', cancerLabel:'Hepatocellular Ca.', stage:'BCLC-B', histology:'HCC — Alcohol Cirrhosis', site:'Liver (Left Lobe)', mutations:['VAR-TP53-Y220C'], biomarkers:['BIO-AFP-HIGH'], drugs:['DR-SORAFENIB'], trials:['TR-KEYNOTE189'], stats:[{label:'Etiology',value:'Alcohol Cirrhosis'},{label:'ECOG',value:'0'}] },

  // ── GASTRIC CANCER (5 patients) ──
  { id:'PT-186', gender:'Male',   age:62, cancerId:'CA-GASTRIC', cancerLabel:'Gastric Cancer', stage:'Stage IV', histology:'Gastric Adenocarcinoma — HER2+', site:'Stomach (Cardia)', mutations:['VAR-HER2-AMP','VAR-TP53-R273H'], biomarkers:['BIO-HER2-POS'], drugs:['DR-TRASTUZUMAB','DR-TDXD'], trials:['TR-DESTINY'], stats:[{label:'HER2',value:'3+ IHC'},{label:'Drug',value:'Trastuzumab + Chemo'}] },
  { id:'PT-187', gender:'Female', age:54, cancerId:'CA-GASTRIC', cancerLabel:'Gastric Cancer', stage:'Stage IV', histology:'Gastric Adenocarcinoma — MSI-H', site:'Stomach (Body)', mutations:['VAR-TP53-Y220C'], biomarkers:['BIO-MSI-H','BIO-TMB-HIGH'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'MSI',value:'MSI-High'},{label:'Drug',value:'Pembrolizumab 1L'}] },
  { id:'PT-188', gender:'Male',   age:70, cancerId:'CA-GASTRIC', cancerLabel:'Gastric Cancer', stage:'Stage IIIB', histology:'GEJ Adenocarcinoma', site:'Gastroesophageal Junction', mutations:['VAR-TP53-R175H','VAR-KRAS-G12V'], biomarkers:['BIO-PDL1-HIGH'], drugs:['DR-NIVOLUMAB'], trials:['TR-CHECKMATE'], stats:[{label:'GEJ',value:'Siewert Type II'},{label:'PD-L1 CPS',value:'>10'}] },
  { id:'PT-189', gender:'Female', age:45, cancerId:'CA-GASTRIC', cancerLabel:'Gastric Cancer', stage:'Stage IV', histology:'Signet Ring Cell Carcinoma', site:'Stomach (Diffuse)', mutations:['VAR-TP53-R273H','VAR-PTEN-LOSS'], biomarkers:['BIO-CEA','BIO-PDL1-LOW'], drugs:['DR-PEMBROLIZUMAB'], trials:['TR-KEYNOTE189'], stats:[{label:'Subtype',value:'Signet Ring'},{label:'Lauren',value:'Diffuse'}] },
  { id:'PT-190', gender:'Male',   age:68, cancerId:'CA-GASTRIC', cancerLabel:'Gastric Cancer', stage:'Stage IV', histology:'Gastric Adenocarcinoma — FGFR2+', site:'Stomach (Antrum)', mutations:['VAR-FGFR3-MUT','VAR-TP53-Y220C'], biomarkers:['BIO-CEA'], drugs:['DR-ERDAFITINIB'], trials:['TR-BLC2001'], stats:[{label:'FGFR2',value:'Amplified'},{label:'Drug',value:'Erdafitinib (off-label)'}] },

  // ── AML (9 patients) ──
  { id:'PT-191', gender:'Male',   age:64, cancerId:'CA-AML', cancerLabel:'AML', stage:'AML — De Novo', histology:'AML — FLT3-ITD', site:'Bone Marrow / Blood', mutations:['VAR-FLT3-ITD','VAR-TP53-R273H'], biomarkers:['BIO-TMB-HIGH'], drugs:['DR-GILTERITINIB'], trials:['TR-QUAZAR'], stats:[{label:'FLT3-ITD',value:'High AR'},{label:'Drug',value:'Gilteritinib'}] },
  { id:'PT-192', gender:'Female', age:55, cancerId:'CA-AML', cancerLabel:'AML', stage:'AML — Secondary (post-MDS)', histology:'AML — IDH1 Mutant', site:'Bone Marrow', mutations:['VAR-IDH1-R132H','VAR-FLT3-ITD'], biomarkers:['BIO-MSI-H'], drugs:['DR-IVOSIDENIB'], trials:['TR-QUAZAR'], stats:[{label:'IDH1',value:'R132H'},{label:'Drug',value:'Ivosidenib'}] },
  { id:'PT-193', gender:'Male',   age:72, cancerId:'CA-AML', cancerLabel:'AML', stage:'AML — Relapsed', histology:'AML — TP53 Mutant (Poor Risk)', site:'Bone Marrow', mutations:['VAR-TP53-R175H','VAR-FLT3-ITD'], biomarkers:['BIO-TMB-HIGH'], drugs:['DR-GILTERITINIB','DR-PEMBROLIZUMAB'], trials:['TR-QUAZAR'], stats:[{label:'TP53',value:'Mutated (poor risk)'},{label:'FLT3',value:'ITD'}] },
  { id:'PT-194', gender:'Female', age:48, cancerId:'CA-AML', cancerLabel:'AML', stage:'AML — NPM1 Mutant', histology:'AML — NPM1 Mutant (Favourable)', site:'Bone Marrow', mutations:['VAR-IDH1-R132H','VAR-NRAS-Q61K'], biomarkers:['BIO-MSI-H'], drugs:['DR-IVOSIDENIB'], trials:['TR-QUAZAR'], stats:[{label:'NPM1',value:'Mutant (favourable)'},{label:'IDH1',value:'R132H'}] },
  { id:'PT-195', gender:'Male',   age:61, cancerId:'CA-AML', cancerLabel:'AML', stage:'AML — Therapy-Related', histology:'t-AML (post-breast ca. chemo)', site:'Bone Marrow', mutations:['VAR-TP53-Y220C','VAR-FLT3-ITD'], biomarkers:['BIO-TMB-HIGH'], drugs:['DR-GILTERITINIB'], trials:['TR-QUAZAR'], stats:[{label:'Etiology',value:'Therapy-related'},{label:'TP53',value:'Mutated'}] },
  { id:'PT-196', gender:'Female', age:38, cancerId:'CA-AML', cancerLabel:'AML', stage:'AML — CBFB Rearrangement', histology:'Inv(16) AML', site:'Bone Marrow', mutations:['VAR-NRAS-Q61K','VAR-TP53-R273H'], biomarkers:['BIO-TMB-HIGH'], drugs:['DR-GILTERITINIB'], trials:['TR-QUAZAR'], stats:[{label:'Cytogenetics',value:'Inv(16) (favourable)'},{label:'NRAS',value:'Q61K'}] },
  { id:'PT-197', gender:'Male',   age:75, cancerId:'CA-AML', cancerLabel:'AML', stage:'AML — Relapsed / Refractory', histology:'AML — IDH2 Mutant', site:'Bone Marrow', mutations:['VAR-NRAS-Q61K','VAR-FLT3-ITD'], biomarkers:['BIO-TMB-HIGH'], drugs:['DR-GILTERITINIB'], trials:['TR-QUAZAR'], stats:[{label:'IDH2',value:'R172K'},{label:'Setting',value:'R/R AML'}] },
  { id:'PT-198', gender:'Female', age:52, cancerId:'CA-AML', cancerLabel:'AML', stage:'AML — Maintenance', histology:'AML post-CR1 Maintenance', site:'Bone Marrow', mutations:['VAR-IDH1-R132H'], biomarkers:['BIO-MSI-H'], drugs:['DR-IVOSIDENIB'], trials:['TR-QUAZAR'], stats:[{label:'Setting',value:'Maintenance post-CR1'},{label:'IDH1',value:'R132H'}] },
  { id:'PT-199', gender:'Male',   age:44, cancerId:'CA-AML', cancerLabel:'AML', stage:'AML — High Risk', histology:'AML — RUNX1-RUNX1T1 (t(8;21))', site:'Bone Marrow', mutations:['VAR-FLT3-ITD','VAR-NRAS-Q61K'], biomarkers:['BIO-TMB-HIGH'], drugs:['DR-GILTERITINIB'], trials:['TR-QUAZAR'], stats:[{label:'Cytogenetics',value:'t(8;21)'},{label:'FLT3',value:'ITD positive'}] },
  { id:'PT-200', gender:'Female', age:68, cancerId:'CA-AML', cancerLabel:'AML', stage:'AML — Secondary post-MPN', histology:'AML evolved from MPN', site:'Bone Marrow', mutations:['VAR-IDH1-R132H','VAR-TP53-R175H'], biomarkers:['BIO-TMB-HIGH'], drugs:['DR-IVOSIDENIB'], trials:['TR-QUAZAR'], stats:[{label:'Etiology',value:'Post-MPN'},{label:'IDH1',value:'R132H'}] },
];

// ─────────────────────────────────────────────────────────────────────────────
// BUILD NODES + LINKS
// ─────────────────────────────────────────────────────────────────────────────

// Extra variants referenced in patient configs that need placeholder nodes

const EXTRA_VARIANT_NODES: OncologyNode[] = [
  { id:'VAR-CDKN2A-DEL', label:'CDKN2A Deletion', type:'variant', val:5, color:'#b624ff', details:{ title:'CDKN2A Homozygous Deletion', subtitle:'Copy Number Loss', description:'p16 loss removes CDK4/6 brake. Common in melanoma and NSCLC.', stats:[{label:'Consequence',value:'CDK4/6 unrestrained'}] } },
  { id:'VAR-APC-MUT',    label:'APC Truncation',   type:'variant', val:5, color:'#b624ff', details:{ title:'APC Truncating Mutation', subtitle:'Frameshift/Nonsense', description:'WNT pathway gatekeeper mutation initiating colorectal carcinogenesis.', stats:[{label:'Pathway',value:'WNT/β-catenin'}] } },
  { id:'VAR-ATM-MUT',    label:'ATM Biallelic',    type:'variant', val:5, color:'#b624ff', details:{ title:'ATM Biallelic Inactivation', subtitle:'Loss of Function', description:'HRD phenotype. PARP inhibitor sensitive.', stats:[{label:'Drug Match',value:'PARP Inhibitors'}] } },
  { id:'VAR-EGFR-AMP',   label:'EGFR Amplif.',     type:'variant', val:5, color:'#b624ff', details:{ title:'EGFR Gene Amplification', subtitle:'Copy Number Gain', description:'Amplification in GBM and squamous tumors.', stats:[{label:'Freq GBM',value:'~50%'}] } },
  { id:'VAR-TP53-R173H', label:'TP53 p.R173H',    type:'variant', val:5, color:'#b624ff', details:{ title:'TP53 p.R173H', subtitle:'Missense • Exon 5', description:'DNA-contact mutation. Loss of tumour suppression.', stats:[{label:'ClinVar',value:'Pathogenic'}] } },
];

const patientNodes: OncologyNode[] = PATIENTS_CONFIG.map(p => ({
  id: p.id, label: p.id, type: 'patient', val: 10, color: '#00f0ff',
  details: {
    title: `Patient ${p.id}`,
    subtitle: `${p.gender}, Age ${p.age} • Active Case`,
    description: `${p.cancerLabel} — ${p.histology}. ${p.stage}. Primary site: ${p.site}.`,
    meta: { Stage: p.stage, 'Primary Site': p.site, Histology: p.histology },
    stats: p.stats,
  }
}));

const allNodes: OncologyNode[] = [
  ...patientNodes,
  ...CANCER_NODES,
  ...GENE_NODES,
  ...VARIANT_NODES,
  ...EXTRA_VARIANT_NODES,
  ...BIOMARKER_NODES,
  ...DRUG_NODES,
  ...TRIAL_NODES,
];

// Deduplicate gene nodes referenced by variant IDs
const VARIANT_GENE_MAP: Record<string,string> = {
  'VAR-PIK3CA-H1047R':'PIK3CA','VAR-PIK3CA-E545K':'PIK3CA',
  'VAR-TP53-R273H':'TP53','VAR-TP53-Y220C':'TP53','VAR-TP53-R175H':'TP53','VAR-TP53-R173H':'TP53',
  'VAR-EGFR-L858R':'EGFR','VAR-EGFR-DEL19':'EGFR','VAR-EGFR-T790M':'EGFR','VAR-EGFR-AMP':'EGFR',
  'VAR-KRAS-G12C':'KRAS','VAR-KRAS-G12D':'KRAS','VAR-KRAS-G12V':'KRAS',
  'VAR-BRAF-V600E':'BRAF','VAR-BRCA1-5266':'BRCA1','VAR-BRCA2-6174':'BRCA2',
  'VAR-ALK-FUSION':'ALK','VAR-MET-EX14':'MET','VAR-RET-FUSION':'RET',
  'VAR-FGFR3-MUT':'FGFR3','VAR-IDH1-R132H':'IDH1','VAR-FLT3-ITD':'FLT3',
  'VAR-NRAS-Q61K':'NRAS','VAR-PTEN-LOSS':'PTEN','VAR-HER2-AMP':'HER2',
  'VAR-ROS1-FUSION':'ROS1','VAR-CDKN2A-DEL':'CDKN2A','VAR-APC-MUT':'APC',
  'VAR-ATM-MUT':'ATM',
};

const CANCER_GENE_MAP: Record<string,string[]> = {
  'CA-BREAST':     ['PIK3CA','TP53','BRCA1','BRCA2','HER2','PTEN'],
  'CA-NSCLC':      ['EGFR','KRAS','ALK','MET','RET','BRAF','ROS1','TP53'],
  'CA-OVARIAN':    ['BRCA1','BRCA2','TP53','PIK3CA','PTEN'],
  'CA-COLORECTAL': ['KRAS','PIK3CA','TP53','BRAF','APC'],
  'CA-PROSTATE':   ['BRCA2','BRCA1','PTEN','TP53','ATM'],
  'CA-PANCREATIC': ['KRAS','BRCA2','BRCA1','TP53','ATM'],
  'CA-MELANOMA':   ['BRAF','NRAS','TP53','PTEN','CDKN2A'],
  'CA-GBM':        ['EGFR','TP53','IDH1','PTEN'],
  'CA-BLADDER':    ['FGFR3','HER2','TP53','PIK3CA'],
  'CA-HCC':        ['TP53','PTEN','KRAS','PIK3CA'],
  'CA-GASTRIC':    ['HER2','TP53','FGFR3','KRAS'],
  'CA-AML':        ['FLT3','IDH1','TP53','NRAS'],
};

const DRUG_TARGET_MAP: Record<string,string[]> = {
  'DR-ALPELISIB':     ['PIK3CA'],
  'DR-OLAPARIB':      ['BRCA1','BRCA2','ATM'],
  'DR-NIRAPARIB':     ['BRCA1','BRCA2'],
  'DR-OSIMERTINIB':   ['EGFR'],
  'DR-SOTORASIB':     ['KRAS'],
  'DR-ADAGRASIB':     ['KRAS'],
  'DR-PEMBROLIZUMAB': ['TP53'],
  'DR-NIVOLUMAB':     ['TP53'],
  'DR-ALECTINIB':     ['ALK'],
  'DR-LORLATINIB':    ['ALK','ROS1'],
  'DR-DABRAFENIB':    ['BRAF'],
  'DR-ERDAFITINIB':   ['FGFR3'],
  'DR-IVOSIDENIB':    ['IDH1'],
  'DR-GILTERITINIB':  ['FLT3'],
  'DR-TRASTUZUMAB':   ['HER2'],
  'DR-TDXD':          ['HER2'],
  'DR-SELPERCATINIB': ['RET'],
  'DR-CAPMATINIB':    ['MET'],
  'DR-CETUXIMAB':     ['EGFR'],
  'DR-SORAFENIB':     ['BRAF'],
  'DR-ENZALUTAMIDE':  ['TP53'],
};

const TRIAL_DRUG_MAP: Record<string,string[]> = {
  'TR-SOLAR-1':    ['DR-ALPELISIB'],
  'TR-FLAURA':     ['DR-OSIMERTINIB'],
  'TR-CODEBREAK':  ['DR-SOTORASIB'],
  'TR-KRYSTAL':    ['DR-ADAGRASIB'],
  'TR-ALEX':       ['DR-ALECTINIB'],
  'TR-CROWN':      ['DR-LORLATINIB'],
  'TR-COMBI-D':    ['DR-DABRAFENIB'],
  'TR-BLC2001':    ['DR-ERDAFITINIB'],
  'TR-QUAZAR':     ['DR-IVOSIDENIB','DR-GILTERITINIB'],
  'TR-PAOLA':      ['DR-OLAPARIB','DR-NIRAPARIB'],
  'TR-KEYNOTE189': ['DR-PEMBROLIZUMAB'],
  'TR-CHECKMATE':  ['DR-NIVOLUMAB'],
  'TR-DESTINY':    ['DR-TDXD'],
  'TR-LIBRETTO':   ['DR-SELPERCATINIB'],
  'TR-GEOMETRY':   ['DR-CAPMATINIB'],
  'TR-PRIME':      ['DR-CETUXIMAB'],
};

const LINK_COLORS = {
  diagnosed_with:    'rgba(255,42,133,0.6)',
  has_mutation:      'rgba(182,36,255,0.5)',
  has_biomarker:     'rgba(255,230,0,0.5)',
  variant_of:        'rgba(255,123,0,0.4)',
  targets:           'rgba(0,255,102,0.45)',
  evaluated_in:      'rgba(0,132,255,0.45)',
  recruiting_for:    'rgba(0,132,255,0.3)',
  associated_cancer: 'rgba(255,42,133,0.35)',
  co_occurrence:     'rgba(180,180,180,0.2)',
};

const links: OncologyLink[] = [];
const seen = new Set<string>();
const addLink = (l: OncologyLink) => {
  const k = `${l.source}|${l.target}|${l.type}`;
  if (!seen.has(k)) { seen.add(k); links.push(l); }
};

// 1. Variant → Gene
for (const [varId, geneId] of Object.entries(VARIANT_GENE_MAP)) {
  addLink({ source:varId, target:geneId, type:'variant_of', color:LINK_COLORS.variant_of, width:1 });
}

// 2. Gene → Cancer
for (const [cancerId, genes] of Object.entries(CANCER_GENE_MAP)) {
  for (const g of genes) {
    addLink({ source:g, target:cancerId, type:'associated_cancer', color:LINK_COLORS.associated_cancer, width:1, dashed:true });
  }
}

// 3. Drug → Gene (targets)
for (const [drugId, genes] of Object.entries(DRUG_TARGET_MAP)) {
  for (const g of genes) {
    addLink({ source:drugId, target:g, type:'targets', color:LINK_COLORS.targets, width:1.5 });
  }
}

// 4. Trial → Drug (evaluated_in)
for (const [trialId, drugs] of Object.entries(TRIAL_DRUG_MAP)) {
  for (const d of drugs) {
    addLink({ source:trialId, target:d, type:'evaluated_in', color:LINK_COLORS.evaluated_in, width:1 });
  }
}

// 5. Patient links
for (const pt of PATIENTS_CONFIG) {
  addLink({ source:pt.id, target:pt.cancerId, type:'diagnosed_with', color:LINK_COLORS.diagnosed_with, width:2 });
  for (const v of pt.mutations) {
    addLink({ source:pt.id, target:v, type:'has_mutation', color:LINK_COLORS.has_mutation, width:1.5 });
  }
  for (const b of pt.biomarkers) {
    addLink({ source:pt.id, target:b, type:'has_biomarker', color:LINK_COLORS.has_biomarker, width:1 });
  }
  for (const d of pt.drugs) {
    addLink({ source:pt.id, target:d, type:'has_mutation', color:LINK_COLORS.targets, width:1 });
  }
  for (const t of pt.trials) {
    addLink({ source:pt.id, target:t, type:'recruiting_for', color:LINK_COLORS.recruiting_for, width:1, dashed:true });
  }
}

export const oncologyData: OncologyData = { nodes: allNodes, links };
