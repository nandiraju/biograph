export interface OncologyNode {
  id: string;
  label: string;
  type: 'patient' | 'gene' | 'variant' | 'cancer' | 'drug' | 'trial' | 'biomarker';
  val: number; // Node weight/visual size
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

export const oncologyData: OncologyData = {
  nodes: [
    // ── PATIENTS ─────────────────────────────────────────────────────────────
    {
      id: 'PT-101',
      label: 'PT-101',
      type: 'patient',
      val: 10,
      color: '#00f0ff',
      details: {
        title: 'Patient PT-101',
        subtitle: 'Female, Age 45 • Active Case',
        description: 'Invasive Ductal Carcinoma. Relapsed status. Selected for comprehensive genomic profiling to identify targeted therapy options.',
        meta: {
          'Stage': 'Stage IV (Metastatic)',
          'Primary Site': 'Breast (Left)',
          'Histology': 'Invasive Ductal Carcinoma',
          'Receptors': 'ER+ (95%), PR+ (80%), HER2- (1+ by IHC)'
        },
        stats: [
          { label: 'Mutations', value: 2 },
          { label: 'Biomarkers', value: 3 },
          { label: 'Targeted Therapies', value: '2 approved' }
        ]
      }
    },
    {
      id: 'PT-102',
      label: 'PT-102',
      type: 'patient',
      val: 10,
      color: '#00f0ff',
      details: {
        title: 'Patient PT-102',
        subtitle: 'Male, Age 62 • Active Case',
        description: 'Non-Small Cell Lung Cancer (Adenocarcinoma). Heavy smoker history (30 pack-years). Acquired resistance to first-line tyrosine kinase inhibitors.',
        meta: {
          'Stage': 'Stage IIIB',
          'Primary Site': 'Lung (Right Upper Lobe)',
          'Histology': 'Adenocarcinoma',
          'Smoking History': 'Yes (Former, 30 pack-years)'
        },
        stats: [
          { label: 'Mutations', value: 2 },
          { label: 'PD-L1 TPS', value: 'High (75%)' },
          { label: 'TMB', value: '11 mut/Mb' }
        ]
      }
    },
    {
      id: 'PT-103',
      label: 'PT-103',
      type: 'patient',
      val: 10,
      color: '#00f0ff',
      details: {
        title: 'Patient PT-103',
        subtitle: 'Female, Age 58 • Active Case',
        description: 'NSCLC (Squamous Cell Carcinoma). Advanced stage with bone metastasis. High Tumor Mutational Burden, KRAS G12C driver identified.',
        meta: {
          'Stage': 'Stage IV',
          'Primary Site': 'Lung (Left Lower Lobe)',
          'Histology': 'Squamous Cell Carcinoma',
          'TMB': '16 mut/Mb (High)'
        },
        stats: [
          { label: 'Mutations', value: 1 },
          { label: 'PD-L1 TPS', value: 'Negative (0%)' },
          { label: 'Targetable Variant', value: 'KRAS p.G12C' }
        ]
      }
    },
    {
      id: 'PT-104',
      label: 'PT-104',
      type: 'patient',
      val: 10,
      color: '#00f0ff',
      details: {
        title: 'Patient PT-104',
        subtitle: 'Female, Age 50 • Active Case',
        description: 'High-grade serous ovarian cancer. Strong family history of breast and ovarian malignancies. BRCA1 founder mutation confirmed on germline panel.',
        meta: {
          'Stage': 'Stage IIIC',
          'Primary Site': 'Ovary (Bilateral)',
          'Histology': 'High-Grade Serous Carcinoma',
          'HRD Score': '52 (Positive)'
        },
        stats: [
          { label: 'Mutations', value: 2 },
          { label: 'HRD Status', value: 'Positive' },
          { label: 'Therapeutic Match', value: 'PARP Inhibitor' }
        ]
      }
    },
    {
      id: 'PT-105',
      label: 'PT-105',
      type: 'patient',
      val: 10,
      color: '#00f0ff',
      details: {
        title: 'Patient PT-105',
        subtitle: 'Male, Age 67 • Active Case',
        description: 'Metastatic Colorectal Cancer. Progressed on FOLFOX chemotherapy. Normal mismatch repair (MSS), dual KRAS + PIK3CA drivers identified.',
        meta: {
          'Stage': 'Stage IV',
          'Primary Site': 'Colon (Sigmoid)',
          'Histology': 'Adenocarcinoma',
          'MMR Status': 'pMMR / MSS'
        },
        stats: [
          { label: 'Mutations', value: 2 },
          { label: 'KRAS Status', value: 'Mutated (G12D)' },
          { label: 'PIK3CA Status', value: 'Mutated (E545K)' }
        ]
      }
    },
    {
      id: 'PT-106',
      label: 'PT-106',
      type: 'patient',
      val: 10,
      color: '#00f0ff',
      details: {
        title: 'Patient PT-106',
        subtitle: 'Male, Age 41 • Active Case',
        description: 'Never-smoker with advanced NSCLC. EML4-ALK fusion driver. Screened via NGS RNA panel — highly responsive to ALK inhibitors, CNS metastases present.',
        meta: {
          'Stage': 'Stage IV',
          'Primary Site': 'Lung (Right Lower Lobe)',
          'Histology': 'Adenocarcinoma',
          'Smoking History': 'Never Smoked'
        },
        stats: [
          { label: 'Fusions', value: 1 },
          { label: 'ALK Status', value: 'Positive (EML4-ALK)' },
          { label: 'Brain Metastases', value: 'Yes (Asymptomatic)' }
        ]
      }
    },

    // ── CANCER TYPES ─────────────────────────────────────────────────────────
    {
      id: 'CA-BREAST',
      label: 'Breast Cancer',
      type: 'cancer',
      val: 12,
      color: '#ff2a85',
      details: {
        title: 'Breast Cancer (HR+/HER2-)',
        subtitle: 'Oncology Indication',
        description: 'Malignancy arising from breast tissue. Most commonly ductal carcinoma. ER+/PR+/HER2- subtype (Luminal A/B) is the most prevalent subtype globally and highly targetable with endocrine + PI3K pathway therapies.',
        stats: [
          { label: 'Global Cases / Year', value: '2.3 Million' },
          { label: 'Key Drivers', value: 'ER, PR, HER2, BRCA1/2, PIK3CA' }
        ]
      }
    },
    {
      id: 'CA-NSCLC',
      label: 'NSCLC',
      type: 'cancer',
      val: 12,
      color: '#ff2a85',
      details: {
        title: 'Non-Small Cell Lung Cancer (NSCLC)',
        subtitle: 'Oncology Indication',
        description: '~85% of all lung cancers. Adenocarcinoma, Squamous Cell Carcinoma, and Large Cell subtypes. Strongly associated with tobacco smoke; driver mutations (EGFR, ALK, KRAS) are common in never-smokers.',
        stats: [
          { label: '5-Year Survival (Metastatic)', value: '7%' },
          { label: 'Key Drivers', value: 'EGFR, ALK, KRAS, ROS1, RET, MET' }
        ]
      }
    },
    {
      id: 'CA-OVARIAN',
      label: 'Ovarian Cancer',
      type: 'cancer',
      val: 12,
      color: '#ff2a85',
      details: {
        title: 'Ovarian Cancer (HGSOC)',
        subtitle: 'Oncology Indication',
        description: 'Epithelial ovarian cancer is the leading cause of death from gynecologic malignancies. Often diagnosed at advanced stages. Highly associated with BRCA1/2 mutations and HRD.',
        stats: [
          { label: 'HRD Rate', value: '50% of Serous Ovarian' },
          { label: 'Standard Therapy', value: 'Platinum doublet + PARP Inhibitor' }
        ]
      }
    },
    {
      id: 'CA-COLORECTAL',
      label: 'Colorectal Cancer',
      type: 'cancer',
      val: 12,
      color: '#ff2a85',
      details: {
        title: 'Colorectal Cancer (CRC)',
        subtitle: 'Oncology Indication',
        description: 'Malignancy of the colon or rectum. Actionability depends on left vs right-sided origin and mismatch repair status. Common drivers include APC, TP53, KRAS, and PIK3CA.',
        stats: [
          { label: 'Common Alterations', value: 'APC, TP53, KRAS, NRAS, BRAF, PIK3CA' },
          { label: 'Immunotherapy Match', value: 'dMMR / MSI-High only' }
        ]
      }
    },

    // ── GENES ─────────────────────────────────────────────────────────────────
    {
      id: 'PIK3CA',
      label: 'PIK3CA',
      type: 'gene',
      val: 8,
      color: '#ff7b00',
      details: {
        title: 'PIK3CA (PI3K Catalytic Subunit Alpha)',
        subtitle: 'Oncogene • Chr 3q26.32',
        description: 'Encodes the p110α catalytic subunit of PI3K. Activating mutations stimulate AKT/mTOR, promoting cell growth and therapy resistance. Frequently mutated in breast and colorectal cancers.',
        stats: [
          { label: 'Frequency in HR+ Breast', value: '35%' },
          { label: 'Inhibitor', value: 'Alpelisib (FDA approved)' },
          { label: 'Evidence Level', value: 'FDA Level 1A' }
        ]
      }
    },
    {
      id: 'TP53',
      label: 'TP53',
      type: 'gene',
      val: 8,
      color: '#ff7b00',
      details: {
        title: 'TP53 (Tumor Protein p53)',
        subtitle: 'Tumor Suppressor • Chr 17p13.1',
        description: '"Guardian of the genome." Regulates cell cycle, DNA repair, and apoptosis. Loss-of-function mutations lead to genomic instability and are the most common alterations across all human cancers.',
        stats: [
          { label: 'Pan-Cancer Frequency', value: '>50% of all cancers' },
          { label: 'Therapeutic Strategy', value: 'Trial agents (APR-246, PC14586)' },
          { label: 'Prognostic Value', value: 'Often aggressive disease' }
        ]
      }
    },
    {
      id: 'EGFR',
      label: 'EGFR',
      type: 'gene',
      val: 8,
      color: '#ff7b00',
      details: {
        title: 'EGFR (Epidermal Growth Factor Receptor)',
        subtitle: 'Oncogene / RTK • Chr 7p11.2',
        description: 'Receptor tyrosine kinase. Activating mutations lead to constitutive kinase activity, driving proliferation. Highly relevant in NSCLC — particularly in non-smokers and Asian cohorts.',
        stats: [
          { label: 'NSCLC Frequency', value: '15% Western / 50% Asian' },
          { label: 'TKI Generations', value: '1st, 2nd, 3rd (Osimertinib)' },
          { label: 'Resistance Mechanism', value: 'T790M, C797S mutations' }
        ]
      }
    },
    {
      id: 'KRAS',
      label: 'KRAS',
      type: 'gene',
      val: 8,
      color: '#ff7b00',
      details: {
        title: 'KRAS (KRAS Proto-Oncogene, GTPase)',
        subtitle: 'Oncogene / RAS family • Chr 12p12.1',
        description: 'GTPase that cycles between active (GTP-bound) and inactive (GDP-bound) states. Activating mutations impair GTP hydrolysis, locking KRAS active and driving RAS/MAPK signaling continuously.',
        stats: [
          { label: 'Frequency', value: '90% Pancreatic, 40% CRC, 30% Lung' },
          { label: 'G12C Inhibitors', value: 'Sotorasib, Adagrasib' },
          { label: 'Resistance Pathway', value: 'Feedback via EGFR/SHP2' }
        ]
      }
    },
    {
      id: 'BRCA1',
      label: 'BRCA1',
      type: 'gene',
      val: 8,
      color: '#ff7b00',
      details: {
        title: 'BRCA1 (BRCA1 DNA Repair Associated)',
        subtitle: 'Tumor Suppressor / HRR • Chr 17q21.31',
        description: 'Involved in homologous recombination repair of DNA double-strand breaks. Inactivation causes HRD, rendering cells highly sensitive to PARP inhibitors via synthetic lethality.',
        stats: [
          { label: 'Carrier Frequency', value: '1 in 400 general population' },
          { label: 'Therapeutic Match', value: 'PARP Inhibitors (Olaparib, Talazoparib)' },
          { label: 'Associated Cancers', value: 'Breast, Ovarian, Prostate, Pancreatic' }
        ]
      }
    },
    {
      id: 'ALK',
      label: 'ALK',
      type: 'gene',
      val: 8,
      color: '#ff7b00',
      details: {
        title: 'ALK (ALK Receptor Tyrosine Kinase)',
        subtitle: 'Oncogene / Kinase • Chr 2p23.2',
        description: 'Receptor tyrosine kinase. EML4-ALK chromosomal rearrangements drive ligand-independent dimerization and MAPK/PI3K/JAK-STAT activation. Highly targetable in NSCLC with multiple TKI generations.',
        stats: [
          { label: 'Fusion Frequency', value: '3-5% of NSCLC' },
          { label: 'Demographics', value: 'Younger, never/light smokers' },
          { label: 'Approved TKIs', value: 'Alectinib, Brigatinib, Lorlatinib' }
        ]
      }
    },

    // ── VARIANTS ─────────────────────────────────────────────────────────────
    {
      id: 'VAR-PIK3CA-H1047R',
      label: 'PIK3CA H1047R',
      type: 'variant',
      val: 5,
      color: '#b624ff',
      details: {
        title: 'PIK3CA p.H1047R',
        subtitle: 'Missense • Exon 21 (Kinase Domain)',
        description: 'Increases lipid kinase activity and hyperactivates PI3K/Akt. Clinically actionable driver mutation — companion diagnostic target for Alpelisib.',
        meta: {
          'AA Change': 'H1047R (His → Arg)',
          'Nucleotide': 'c.3140A>G',
          'ClinVar': 'Pathogenic',
          'Actionability': 'Tier IA (FDA companion diagnostic)'
        },
        stats: [
          { label: 'VAF (Typical)', value: '15 - 45%' },
          { label: 'ClinVar ID', value: '13653' },
          { label: 'Matched Therapy', value: 'Alpelisib + Fulvestrant' }
        ]
      }
    },
    {
      id: 'VAR-PIK3CA-E545K',
      label: 'PIK3CA E545K',
      type: 'variant',
      val: 5,
      color: '#b624ff',
      details: {
        title: 'PIK3CA p.E545K',
        subtitle: 'Missense • Exon 9 (Helical Domain)',
        description: 'Helical domain hotspot disrupting p85 inhibitory interaction, causing constitutive PI3K/AKT/mTOR pathway activation.',
        meta: {
          'AA Change': 'E545K (Glu → Lys)',
          'Nucleotide': 'c.1633G>A',
          'ClinVar': 'Pathogenic',
          'Hotspot': 'Yes'
        },
        stats: [
          { label: 'ClinVar ID', value: '13648' },
          { label: 'Sensitivity', value: 'α-selective PI3K inhibitors' }
        ]
      }
    },
    {
      id: 'VAR-TP53-R273H',
      label: 'TP53 p.R273H',
      type: 'variant',
      val: 5,
      color: '#b624ff',
      details: {
        title: 'TP53 p.R273H',
        subtitle: 'Missense • Exon 8 (DNA-Binding Domain)',
        description: 'Hotspot DNA-contact mutation. Prevents p53 from binding DNA, neutralizing its tumor suppressor function and promoting cell survival.',
        meta: {
          'AA Change': 'R273H (Arg → His)',
          'Nucleotide': 'c.818G>A',
          'ClinVar': 'Pathogenic',
          'Hotspot': 'Yes'
        },
        stats: [
          { label: 'ClinVar ID', value: '12781' },
          { label: 'Prognostic', value: 'Poor survival / chemoresistance' }
        ]
      }
    },
    {
      id: 'VAR-TP53-Y220C',
      label: 'TP53 p.Y220C',
      type: 'variant',
      val: 5,
      color: '#b624ff',
      details: {
        title: 'TP53 p.Y220C',
        subtitle: 'Structural Missense • Exon 6',
        description: 'Creates a cavity in the DNA-binding domain destabilizing p53 at physiological temperature. Target of pharmacologic chaperones in clinical trials.',
        meta: {
          'AA Change': 'Y220C (Tyr → Cys)',
          'Nucleotide': 'c.659A>G',
          'ClinVar': 'Pathogenic'
        },
        stats: [
          { label: 'ClinVar ID', value: '12773' },
          { label: 'Investigational Drug', value: 'PC14586 (chaperone)' }
        ]
      }
    },
    {
      id: 'VAR-EGFR-L858R',
      label: 'EGFR p.L858R',
      type: 'variant',
      val: 5,
      color: '#b624ff',
      details: {
        title: 'EGFR p.L858R',
        subtitle: 'Missense • Exon 21 (Kinase Domain)',
        description: 'Major activating hotspot. Promotes kinase activation loops in absence of ligand binding. Highly sensitive to all EGFR TKI generations.',
        meta: {
          'AA Change': 'L858R (Leu → Arg)',
          'Nucleotide': 'c.2573T>G',
          'ClinVar': 'Pathogenic',
          'Actionability': 'Tier IA'
        },
        stats: [
          { label: 'Share of EGFR+ Cases', value: '40%' },
          { label: 'ClinVar ID', value: '16578' },
          { label: 'First-Line Therapy', value: 'Osimertinib' }
        ]
      }
    },
    {
      id: 'VAR-EGFR-T790M',
      label: 'EGFR p.T790M',
      type: 'variant',
      val: 5,
      color: '#b624ff',
      details: {
        title: 'EGFR p.T790M',
        subtitle: 'Gatekeeper Mutation • Exon 20',
        description: 'Increases ATP affinity, outcompeting 1st-gen TKIs. Secondary resistance mutation acquired in ~50-60% of 1st-gen TKI failures. Sensitive to Osimertinib.',
        meta: {
          'AA Change': 'T790M (Thr → Met)',
          'Nucleotide': 'c.2369C>T',
          'ClinVar': 'Pathogenic',
          'Context': 'Acquired resistance (2nd mutation)'
        },
        stats: [
          { label: 'ClinVar ID', value: '16572' },
          { label: 'Therapy', value: 'Osimertinib (3rd-gen TKI)' }
        ]
      }
    },
    {
      id: 'VAR-KRAS-G12C',
      label: 'KRAS p.G12C',
      type: 'variant',
      val: 5,
      color: '#b624ff',
      details: {
        title: 'KRAS p.G12C',
        subtitle: 'Hotspot Missense • Exon 2 (Codon 12)',
        description: 'Cysteine substitution locks KRAS in active state. Targeted by covalent inhibitors binding the switch-II pocket of GDP-bound KRAS.',
        meta: {
          'AA Change': 'G12C (Gly → Cys)',
          'Nucleotide': 'c.34G>T',
          'ClinVar': 'Pathogenic',
          'Actionability': 'Tier IA'
        },
        stats: [
          { label: 'NSCLC Frequency', value: '13% of all NSCLC' },
          { label: 'ClinVar ID', value: '12582' },
          { label: 'Inhibitors', value: 'Sotorasib, Adagrasib' }
        ]
      }
    },
    {
      id: 'VAR-KRAS-G12D',
      label: 'KRAS p.G12D',
      type: 'variant',
      val: 5,
      color: '#b624ff',
      details: {
        title: 'KRAS p.G12D',
        subtitle: 'Hotspot Missense • Exon 2 (Codon 12)',
        description: 'Aspartic acid substitution. Common driver in colorectal and pancreatic cancers. Historically undruggable, now in active clinical trials.',
        meta: {
          'AA Change': 'G12D (Gly → Asp)',
          'Nucleotide': 'c.35G>A',
          'ClinVar': 'Pathogenic'
        },
        stats: [
          { label: 'CRC Frequency', value: '12-15% of CRC' },
          { label: 'ClinVar ID', value: '12584' },
          { label: 'Investigational', value: 'MRTX1133' }
        ]
      }
    },
    {
      id: 'VAR-BRCA1-5266dupC',
      label: 'BRCA1 5266dupC',
      type: 'variant',
      val: 5,
      color: '#b624ff',
      details: {
        title: 'BRCA1 c.5266dupC',
        subtitle: 'Frameshift Insertion • Exon 20',
        description: 'Ashkenazi Jewish founder mutation. Cytosine insertion shifts reading frame creating premature stop codon → truncated, non-functional BRCA1 → HRD.',
        meta: {
          'Nucleotide': 'c.5266dupC (formerly 5382insC)',
          'Protein Effect': 'p.Gln1756Profs*74',
          'ClinVar': 'Pathogenic (Germline)',
          'Mechanism': 'Truncation / Loss of HRR'
        },
        stats: [
          { label: 'ClinVar ID', value: '5557' },
          { label: 'Carrier Rate (Ashkenazi)', value: '1 in 100' },
          { label: 'Drug Class', value: 'PARP Inhibitors' }
        ]
      }
    },
    {
      id: 'VAR-ALK-FUSION',
      label: 'EML4-ALK Fusion',
      type: 'variant',
      val: 5,
      color: '#b624ff',
      details: {
        title: 'EML4-ALK Fusion Transcript',
        subtitle: 'Chromosomal Inversion • inv(2)(p21;p23)',
        description: 'Juxtaposition of EML4 5\' with ALK 3\' kinase domain. Causes ligand-independent dimerization and constitutive ALK kinase activity, driving MAPK/PI3K/JAK-STAT signaling.',
        meta: {
          'Variant Type': 'Structural Rearrangement',
          'Partner Gene': 'EML4',
          'ClinVar': 'Pathogenic',
          'Detection': 'NGS (RNA-seq), FISH, or IHC'
        },
        stats: [
          { label: 'Actionability', value: 'Tier IA (Highly responsive)' },
          { label: 'Matched TKIs', value: 'Alectinib, Lorlatinib' }
        ]
      }
    },

    // ── BIOMARKERS ──────────────────────────────────────────────────────────
    {
      id: 'BIO-ER-POS',
      label: 'ER-Positive',
      type: 'biomarker',
      val: 4,
      color: '#ffe600',
      details: {
        title: 'Estrogen Receptor Positive (ER+)',
        subtitle: 'Hormone Receptor Status',
        description: 'Tumor cells express estrogen receptors and grow in response to estrogen. Actionable biomarker indicating suitability for endocrine therapies.',
        stats: [
          { label: 'Testing Method', value: 'IHC' },
          { label: 'Actionable Cutoff', value: '>= 1% staining' },
          { label: 'Therapy', value: 'Tamoxifen, Aromatase Inhibitors' }
        ]
      }
    },
    {
      id: 'BIO-PR-POS',
      label: 'PR-Positive',
      type: 'biomarker',
      val: 4,
      color: '#ffe600',
      details: {
        title: 'Progesterone Receptor Positive (PR+)',
        subtitle: 'Hormone Receptor Status',
        description: 'Tumor cells express progesterone receptors. High PR is a positive prognostic indicator for endocrine therapy success, associated with Luminal A/B subtype.',
        stats: [
          { label: 'Testing Method', value: 'IHC' },
          { label: 'Association', value: 'Luminal A/B breast cancer' }
        ]
      }
    },
    {
      id: 'BIO-HER2-NEG',
      label: 'HER2-Negative',
      type: 'biomarker',
      val: 4,
      color: '#ffe600',
      details: {
        title: 'HER2 Receptor Negative',
        subtitle: 'Oncogene Expression Status',
        description: 'Normal HER2 protein levels and no gene amplification. Excludes anti-HER2 standard therapies. Relevant for PI3K pathway therapy eligibility.',
        stats: [
          { label: 'Testing', value: 'IHC (1+), FISH negative' },
          { label: 'Relevance', value: 'Luminal vs HER2-enriched classification' }
        ]
      }
    },
    {
      id: 'BIO-PDL1-HIGH',
      label: 'PD-L1 High',
      type: 'biomarker',
      val: 4,
      color: '#ffe600',
      details: {
        title: 'PD-L1 Expression High (TPS ≥ 50%)',
        subtitle: 'Immune Checkpoint Biomarker',
        description: 'High PD-L1 on tumor cells predicts superior response to checkpoint inhibitor immunotherapy (Pembrolizumab) as monotherapy in NSCLC.',
        stats: [
          { label: 'Testing Clone', value: '22C3 PharmDx IHC' },
          { label: 'Clinical Match', value: 'First-line immunotherapy (no chemo)' }
        ]
      }
    },
    {
      id: 'BIO-TMB-HIGH',
      label: 'TMB-High',
      type: 'biomarker',
      val: 4,
      color: '#ffe600',
      details: {
        title: 'Tumor Mutational Burden High (TMB-H)',
        subtitle: 'Genomic Biomarker',
        description: 'Quantity of somatic mutations per megabase of tumor DNA. High TMB (≥ 10 mut/Mb) generates more neoantigens, increasing tumor immunogenicity and response to immunotherapy.',
        stats: [
          { label: 'Threshold', value: '>= 10 mutations/Mb' },
          { label: 'FDA Approval', value: 'Pembrolizumab — any solid tumor TMB-H' }
        ]
      }
    },

    // ── DRUGS ────────────────────────────────────────────────────────────────
    {
      id: 'DR-ALPELISIB',
      label: 'Alpelisib',
      type: 'drug',
      val: 6,
      color: '#00ff66',
      details: {
        title: 'Alpelisib (Piqray)',
        subtitle: 'α-Specific PI3K Inhibitor • Novartis',
        description: 'Orally administered PI3K-alpha selective inhibitor. Approved with Fulvestrant for HR+/HER2-/PIK3CA-mutated metastatic breast cancer post-endocrine therapy progression.',
        stats: [
          { label: 'FDA Approval', value: 'May 2019' },
          { label: 'Side Effects', value: 'Hyperglycemia, Rash, Diarrhea' },
          { label: 'Target', value: 'PIK3CA Helical/Kinase mutations' }
        ]
      }
    },
    {
      id: 'DR-OLAPARIB',
      label: 'Olaparib',
      type: 'drug',
      val: 6,
      color: '#00ff66',
      details: {
        title: 'Olaparib (Lynparza)',
        subtitle: 'PARP Inhibitor • AstraZeneca/Merck',
        description: 'First-in-class PARP-1/2/3 inhibitor. Induces synthetic lethality in HRD tumors (BRCA1/2 mutations). Approved across ovarian, breast, prostate, and pancreatic cancers.',
        stats: [
          { label: 'FDA Approval', value: 'Dec 2014 (Ovarian)' },
          { label: 'Target Alterations', value: 'BRCA1/2, HRD positive' },
          { label: 'Indications', value: 'Ovarian, Breast, Prostate, Pancreatic' }
        ]
      }
    },
    {
      id: 'DR-OSIMERTINIB',
      label: 'Osimertinib',
      type: 'drug',
      val: 6,
      color: '#00ff66',
      details: {
        title: 'Osimertinib (Tagrisso)',
        subtitle: '3rd-Gen EGFR TKI • AstraZeneca',
        description: 'Irreversible EGFR TKI selective for sensitizing mutations (L858R, Exon 19 del) and T790M resistance, while sparing wild-type EGFR. Excellent blood-brain barrier penetration.',
        stats: [
          { label: 'FDA Approval', value: 'Nov 2015' },
          { label: 'Brain Penetration', value: 'Excellent' },
          { label: 'Mechanism', value: 'Covalent binding to Cys797' }
        ]
      }
    },
    {
      id: 'DR-SOTORASIB',
      label: 'Sotorasib',
      type: 'drug',
      val: 6,
      color: '#00ff66',
      details: {
        title: 'Sotorasib (Lumakras)',
        subtitle: 'KRAS G12C Covalent Inhibitor • Amgen',
        description: 'First-in-class covalent KRAS G12C inhibitor. Irreversibly binds to Cys12, trapping KRAS in its inactive GDP-bound state and shutting down downstream MAPK signaling.',
        stats: [
          { label: 'FDA Approval', value: 'May 2021 (Accelerated)' },
          { label: 'Indication', value: 'KRAS G12C mutated advanced NSCLC' },
          { label: 'Evidence Level', value: 'Tier IA' }
        ]
      }
    },
    {
      id: 'DR-PEMBROLIZUMAB',
      label: 'Pembrolizumab',
      type: 'drug',
      val: 6,
      color: '#00ff66',
      details: {
        title: 'Pembrolizumab (Keytruda)',
        subtitle: 'Anti-PD-1 mAb • Merck',
        description: 'Humanized IgG4 anti-PD-1 monoclonal antibody blocking PD-L1/PD-L2 interactions. Releases T-cell inhibition to attack tumor cells. Tissue-agnostic approvals for MSI-H and TMB-H tumors.',
        stats: [
          { label: 'First FDA Approval', value: 'Sept 2014' },
          { label: 'Tissue-Agnostic', value: 'MSI-H/dMMR, TMB-H (≥10 mut/Mb)' },
          { label: 'Route', value: 'IV Infusion' }
        ]
      }
    },
    {
      id: 'DR-ALECTINIB',
      label: 'Alectinib',
      type: 'drug',
      val: 6,
      color: '#00ff66',
      details: {
        title: 'Alectinib (Alecensa)',
        subtitle: '2nd-Gen ALK Inhibitor • Roche/Chugai',
        description: 'Highly selective, brain-penetrant ALK and RET inhibitor. First-line standard for ALK-rearranged NSCLC, with superior PFS and CNS control vs crizotinib.',
        stats: [
          { label: 'FDA Approval', value: 'Dec 2015' },
          { label: 'CNS Response', value: '81%' },
          { label: 'PFS (Median)', value: '34.8 mos vs 10.9 (Crizotinib)' }
        ]
      }
    },

    // ── CLINICAL TRIALS ──────────────────────────────────────────────────────
    {
      id: 'TR-SOLAR-1',
      label: 'SOLAR-1 Trial',
      type: 'trial',
      val: 5,
      color: '#0084ff',
      details: {
        title: 'NCT03868696: SOLAR-1 Phase III',
        subtitle: 'Phase III RCT • Completed',
        description: 'Alpelisib + Fulvestrant vs Placebo + Fulvestrant in HR+/HER2- advanced breast cancer progressing on endocrine therapy.',
        stats: [
          { label: 'PFS', value: '11.0 vs 5.7 months (p < 0.001)' },
          { label: 'Eligibility', value: 'PIK3CA mutation positive' }
        ]
      }
    },
    {
      id: 'TR-FLAURA',
      label: 'FLAURA Trial',
      type: 'trial',
      val: 5,
      color: '#0084ff',
      details: {
        title: 'NCT02296138: FLAURA Phase III',
        subtitle: 'Phase III RCT • Completed',
        description: 'Osimertinib vs standard EGFR TKI (Gefitinib/Erlotinib) as first-line in EGFR+ advanced NSCLC.',
        stats: [
          { label: 'OS', value: '38.6 vs 31.8 months (HR 0.80)' },
          { label: 'PFS', value: '18.9 vs 10.2 months (HR 0.46)' }
        ]
      }
    },
    {
      id: 'TR-CODEBREAK',
      label: 'CodeBreaK 200',
      type: 'trial',
      val: 5,
      color: '#0084ff',
      details: {
        title: 'NCT03600883: CodeBreaK 200 Phase III',
        subtitle: 'Phase III RCT • Completed',
        description: 'Sotorasib vs Docetaxel in KRAS G12C-mutated NSCLC post platinum-chemo + checkpoint inhibitor.',
        stats: [
          { label: 'ORR', value: '28.1% vs 13.2% (p < 0.005)' },
          { label: 'Sample Size', value: '345 patients' }
        ]
      }
    },
    {
      id: 'TR-ALUR',
      label: 'ALUR Trial',
      type: 'trial',
      val: 5,
      color: '#0084ff',
      details: {
        title: 'NCT02034981: ALUR Phase III',
        subtitle: 'Phase III RCT • Completed',
        description: 'Alectinib vs chemotherapy in ALK-rearranged NSCLC post-platinum and Crizotinib progression.',
        stats: [
          { label: 'PFS', value: '9.6 vs 1.4 months (HR 0.15)' },
          { label: 'CNS PFS', value: 'Not reached vs 1.8 months' }
        ]
      }
    },
    {
      id: 'TR-KEYNOTE024',
      label: 'KEYNOTE-024',
      type: 'trial',
      val: 5,
      color: '#0084ff',
      details: {
        title: 'NCT02030912: KEYNOTE-024 Phase III',
        subtitle: 'Phase III RCT • Completed',
        description: 'Pembrolizumab monotherapy vs platinum-doublet chemo as first-line in advanced NSCLC with PD-L1 TPS ≥ 50%.',
        stats: [
          { label: '5-Year OS Rate', value: '31.9% vs 16.3%' },
          { label: 'PFS', value: '10.3 vs 6.0 months' }
        ]
      }
    },
    {
      id: 'TR-OLAPARIB-OV',
      label: 'PARP-OV Trial',
      type: 'trial',
      val: 5,
      color: '#0084ff',
      details: {
        title: 'NCT03737643: Ovarian PARP Study',
        subtitle: 'Phase III • Active, Recruiting',
        description: 'Olaparib maintenance in newly diagnosed advanced serous ovarian cancer with BRCA1/2 mutations or HRD.',
        stats: [
          { label: 'Estimated Enrollment', value: '450 patients' },
          { label: 'Status', value: 'Actively Recruiting' }
        ]
      }
    }
  ],

  links: [
    // ── PATIENT → CANCER TYPE (diagnosed_with) ───────────────────────────────
    { source: 'PT-101', target: 'CA-BREAST',      type: 'diagnosed_with', color: '#ff2a85', width: 2.5 },
    { source: 'PT-104', target: 'CA-OVARIAN',     type: 'diagnosed_with', color: '#ff2a85', width: 2.5 },
    { source: 'PT-102', target: 'CA-NSCLC',       type: 'diagnosed_with', color: '#ff2a85', width: 2.5 },
    { source: 'PT-103', target: 'CA-NSCLC',       type: 'diagnosed_with', color: '#ff2a85', width: 2.5 },
    { source: 'PT-106', target: 'CA-NSCLC',       type: 'diagnosed_with', color: '#ff2a85', width: 2.5 },
    { source: 'PT-105', target: 'CA-COLORECTAL',  type: 'diagnosed_with', color: '#ff2a85', width: 2.5 },

    // ── PATIENT → VARIANT (has_mutation) ────────────────────────────────────
    { source: 'PT-101', target: 'VAR-PIK3CA-H1047R',  type: 'has_mutation', color: '#00f0ff', width: 1.8 },
    { source: 'PT-101', target: 'VAR-TP53-R273H',     type: 'has_mutation', color: '#00f0ff', width: 1.8 },
    { source: 'PT-102', target: 'VAR-EGFR-L858R',     type: 'has_mutation', color: '#00f0ff', width: 1.8 },
    { source: 'PT-102', target: 'VAR-EGFR-T790M',     type: 'has_mutation', color: '#00f0ff', width: 1.8 },
    { source: 'PT-103', target: 'VAR-KRAS-G12C',      type: 'has_mutation', color: '#00f0ff', width: 1.8 },
    { source: 'PT-104', target: 'VAR-BRCA1-5266dupC', type: 'has_mutation', color: '#00f0ff', width: 1.8 },
    { source: 'PT-104', target: 'VAR-TP53-Y220C',     type: 'has_mutation', color: '#00f0ff', width: 1.8 },
    { source: 'PT-105', target: 'VAR-KRAS-G12D',      type: 'has_mutation', color: '#00f0ff', width: 1.8 },
    { source: 'PT-105', target: 'VAR-PIK3CA-E545K',   type: 'has_mutation', color: '#00f0ff', width: 1.8 },
    { source: 'PT-106', target: 'VAR-ALK-FUSION',     type: 'has_mutation', color: '#00f0ff', width: 1.8 },

    // ── PATIENT → BIOMARKER (has_biomarker) ──────────────────────────────────
    { source: 'PT-101', target: 'BIO-ER-POS',    type: 'has_biomarker', color: '#ffe600', width: 1.2 },
    { source: 'PT-101', target: 'BIO-PR-POS',    type: 'has_biomarker', color: '#ffe600', width: 1.2 },
    { source: 'PT-101', target: 'BIO-HER2-NEG',  type: 'has_biomarker', color: '#ffe600', width: 1.2 },
    { source: 'PT-102', target: 'BIO-PDL1-HIGH', type: 'has_biomarker', color: '#ffe600', width: 1.2 },
    { source: 'PT-103', target: 'BIO-TMB-HIGH',  type: 'has_biomarker', color: '#ffe600', width: 1.2 },
    { source: 'PT-105', target: 'BIO-HER2-NEG',  type: 'has_biomarker', color: '#ffe600', width: 1.2 },

    // ── VARIANT → GENE (variant_of) ──────────────────────────────────────────
    { source: 'VAR-PIK3CA-H1047R',  target: 'PIK3CA', type: 'variant_of', color: '#8b5cf6', width: 1.5 },
    { source: 'VAR-PIK3CA-E545K',   target: 'PIK3CA', type: 'variant_of', color: '#8b5cf6', width: 1.5 },
    { source: 'VAR-TP53-R273H',     target: 'TP53',   type: 'variant_of', color: '#8b5cf6', width: 1.5 },
    { source: 'VAR-TP53-Y220C',     target: 'TP53',   type: 'variant_of', color: '#8b5cf6', width: 1.5 },
    { source: 'VAR-EGFR-L858R',     target: 'EGFR',   type: 'variant_of', color: '#8b5cf6', width: 1.5 },
    { source: 'VAR-EGFR-T790M',     target: 'EGFR',   type: 'variant_of', color: '#8b5cf6', width: 1.5 },
    { source: 'VAR-KRAS-G12C',      target: 'KRAS',   type: 'variant_of', color: '#8b5cf6', width: 1.5 },
    { source: 'VAR-KRAS-G12D',      target: 'KRAS',   type: 'variant_of', color: '#8b5cf6', width: 1.5 },
    { source: 'VAR-BRCA1-5266dupC', target: 'BRCA1',  type: 'variant_of', color: '#8b5cf6', width: 1.5 },
    { source: 'VAR-ALK-FUSION',     target: 'ALK',    type: 'variant_of', color: '#8b5cf6', width: 1.5 },

    // ── GENE → CANCER TYPE (associated_cancer) ────────────────────────────────
    { source: 'PIK3CA', target: 'CA-BREAST',     type: 'associated_cancer', color: '#ff7b00', width: 1.2 },
    { source: 'PIK3CA', target: 'CA-COLORECTAL', type: 'associated_cancer', color: '#ff7b00', width: 1.0 },
    { source: 'TP53',   target: 'CA-BREAST',     type: 'associated_cancer', color: '#ff7b00', width: 1.0 },
    { source: 'TP53',   target: 'CA-OVARIAN',    type: 'associated_cancer', color: '#ff7b00', width: 1.0 },
    { source: 'EGFR',   target: 'CA-NSCLC',      type: 'associated_cancer', color: '#ff7b00', width: 1.5 },
    { source: 'KRAS',   target: 'CA-NSCLC',      type: 'associated_cancer', color: '#ff7b00', width: 1.2 },
    { source: 'KRAS',   target: 'CA-COLORECTAL', type: 'associated_cancer', color: '#ff7b00', width: 1.2 },
    { source: 'BRCA1',  target: 'CA-OVARIAN',    type: 'associated_cancer', color: '#ff7b00', width: 1.5 },
    { source: 'BRCA1',  target: 'CA-BREAST',     type: 'associated_cancer', color: '#ff7b00', width: 1.0 },
    { source: 'ALK',    target: 'CA-NSCLC',      type: 'associated_cancer', color: '#ff7b00', width: 1.5 },

    // ── VARIANT → DRUG (targets) ─────────────────────────────────────────────
    { source: 'VAR-PIK3CA-H1047R',  target: 'DR-ALPELISIB',     type: 'targets', color: '#00ff66', width: 2.2 },
    { source: 'VAR-PIK3CA-E545K',   target: 'DR-ALPELISIB',     type: 'targets', color: '#00ff66', width: 2.2 },
    { source: 'VAR-BRCA1-5266dupC', target: 'DR-OLAPARIB',      type: 'targets', color: '#00ff66', width: 2.2 },
    { source: 'VAR-EGFR-L858R',     target: 'DR-OSIMERTINIB',   type: 'targets', color: '#00ff66', width: 2.2 },
    { source: 'VAR-EGFR-T790M',     target: 'DR-OSIMERTINIB',   type: 'targets', color: '#00ff66', width: 2.2 },
    { source: 'VAR-KRAS-G12C',      target: 'DR-SOTORASIB',     type: 'targets', color: '#00ff66', width: 2.2 },
    { source: 'VAR-ALK-FUSION',     target: 'DR-ALECTINIB',     type: 'targets', color: '#00ff66', width: 2.2 },
    { source: 'BIO-PDL1-HIGH',      target: 'DR-PEMBROLIZUMAB', type: 'targets', color: '#00ff66', width: 1.8 },
    { source: 'BIO-TMB-HIGH',       target: 'DR-PEMBROLIZUMAB', type: 'targets', color: '#00ff66', width: 1.8 },

    // ── DRUG → TRIAL (evaluated_in) ──────────────────────────────────────────
    { source: 'DR-ALPELISIB',     target: 'TR-SOLAR-1',    type: 'evaluated_in', color: '#0084ff', width: 1.5 },
    { source: 'DR-OSIMERTINIB',   target: 'TR-FLAURA',     type: 'evaluated_in', color: '#0084ff', width: 1.5 },
    { source: 'DR-SOTORASIB',     target: 'TR-CODEBREAK',  type: 'evaluated_in', color: '#0084ff', width: 1.5 },
    { source: 'DR-ALECTINIB',     target: 'TR-ALUR',       type: 'evaluated_in', color: '#0084ff', width: 1.5 },
    { source: 'DR-PEMBROLIZUMAB', target: 'TR-KEYNOTE024', type: 'evaluated_in', color: '#0084ff', width: 1.5 },
    { source: 'DR-OLAPARIB',      target: 'TR-OLAPARIB-OV',type: 'evaluated_in', color: '#0084ff', width: 1.5 },

    // ── CANCER → TRIAL (recruiting_for) ──────────────────────────────────────
    { source: 'CA-BREAST',     target: 'TR-SOLAR-1',     type: 'recruiting_for', color: '#ff2a85', width: 1.0 },
    { source: 'CA-NSCLC',      target: 'TR-FLAURA',      type: 'recruiting_for', color: '#ff2a85', width: 1.0 },
    { source: 'CA-NSCLC',      target: 'TR-CODEBREAK',   type: 'recruiting_for', color: '#ff2a85', width: 1.0 },
    { source: 'CA-NSCLC',      target: 'TR-ALUR',        type: 'recruiting_for', color: '#ff2a85', width: 1.0 },
    { source: 'CA-NSCLC',      target: 'TR-KEYNOTE024',  type: 'recruiting_for', color: '#ff2a85', width: 1.0 },
    { source: 'CA-OVARIAN',    target: 'TR-OLAPARIB-OV', type: 'recruiting_for', color: '#ff2a85', width: 1.0 },

    // ── CO-OCCURRENCE (co-mutations within same patient) ─────────────────────
    { source: 'VAR-PIK3CA-H1047R',  target: 'VAR-TP53-R273H',    type: 'co_occurrence', color: 'rgba(255,255,255,0.2)', width: 0.8, dashed: true },
    { source: 'VAR-BRCA1-5266dupC', target: 'VAR-TP53-Y220C',    type: 'co_occurrence', color: 'rgba(255,255,255,0.2)', width: 0.8, dashed: true },
    { source: 'VAR-EGFR-L858R',     target: 'VAR-EGFR-T790M',    type: 'co_occurrence', color: 'rgba(255,255,255,0.2)', width: 0.8, dashed: true },
    { source: 'VAR-KRAS-G12D',      target: 'VAR-PIK3CA-E545K',  type: 'co_occurrence', color: 'rgba(255,255,255,0.2)', width: 0.8, dashed: true },
  ]
};

export interface Scenario {
  id: string;
  name: string;
  description: string;
  focusNodeId?: string;
  filterTypes?: Array<OncologyNode['type']>;
}

export const scenarios: Scenario[] = [
  {
    id: 'global',
    name: 'Global Cohort Map',
    description: 'Full precision oncology knowledge network — patients, cancer types, genomic drivers, targeted therapies, and clinical trials.',
  },
  {
    id: 'patient-network',
    name: 'Patient Network View',
    description: 'Patient-centric view showing all 6 patients directly connected to their cancer diagnoses, gene mutations, and variant profiles.',
    filterTypes: ['patient', 'cancer', 'gene', 'variant'],
  },
  {
    id: 'pt-101-focus',
    name: 'Breast Cancer Case (PT-101)',
    description: 'Focuses on PT-101 with ER+/HER2- Breast Cancer. Traces PIK3CA H1047R and TP53 R273H mutations through to Alpelisib therapy and the SOLAR-1 trial.',
    focusNodeId: 'PT-101',
  },
  {
    id: 'lung-cohort',
    name: 'NSCLC Drivers Cohort',
    description: 'Lung cancer driver network — 3 NSCLC patients (PT-102, PT-103, PT-106) with EGFR, KRAS G12C, and ALK-EML4 fusion drivers and their matched TKIs.',
    focusNodeId: 'CA-NSCLC',
    filterTypes: ['patient', 'gene', 'variant', 'cancer', 'drug', 'trial', 'biomarker'],
  },
  {
    id: 'druggable-web',
    name: 'Druggable Genome Web',
    description: 'Researcher view — direct map from genomic targets (Genes, Variants) to approved therapies and clinical trials. Patients excluded.',
    filterTypes: ['gene', 'variant', 'cancer', 'drug', 'trial', 'biomarker'],
  },
];
