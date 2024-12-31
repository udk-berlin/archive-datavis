create table
  public.archive (
    id uuid not null default gen_random_uuid (),
    name text null,
    created_at timestamp with time zone not null default now(),
    col numeric null,
    row numeric null,
    "physicalId" text null,
    medium uuid null,
    type uuid null,
    "subType" uuid null,
    "archiveAuthors" jsonb null default '[]'::jsonb,
    "references" jsonb null default '[]'::jsonb,
    allocation jsonb null default '{}'::jsonb,
    "additionalInformation" text null,
    authors uuid[] null,
    constraint archive_pkey primary key (id)
  ) tablespace pg_default;


create table
  public."authorTypes" (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name text null,
    constraint authorTypes_pkey primary key (id)
  ) tablespace pg_default;


  create table
  public.authors (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name text null,
    "firstName" text null,
    semesters uuid[] null,
    additional jsonb null default '{}'::jsonb,
    "contactInfo" jsonb null default '{}'::jsonb,
    type jsonb null default '[]'::jsonb,
    constraint authors_pkey primary key (id)
  ) tablespace pg_default;

  create table
  public.entries (
    id uuid not null default gen_random_uuid (),
    name text null,
    created_at timestamp with time zone not null default now(),
    semester uuid[] null,
    dbtype text null,
    additional jsonb null default '{}'::jsonb,
    authors uuid[] null,
    abstract text null,
    thumbnail text null,
    files uuid[] null,
    allocation jsonb null,
    "originalCreated" timestamp with time zone null,
    assets text[] null,
    constraint entries_pkey primary key (id)
  ) tablespace pg_default;

  create table
  public."fileMetadata" (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    filepath text null,
    parent uuid null,
    type text null,
    hash text null,
    mimetype text null,
    filetype text null,
    "firstNameChar" text null,
    namelength numeric null,
    "filepathHash" text null,
    children uuid[] null,
    "fileID" uuid null,
    constraint fileMetadata_pkey primary key (id)
  ) tablespace pg_default;

  create table
  public."semesterTypes" (
    id uuid not null default gen_random_uuid (),
    name text null,
    created_at timestamp with time zone not null default now(),
    constraint semesterTypes_pkey primary key (id)
  ) tablespace pg_default;



  create table
  public.semesters (
    id uuid not null default gen_random_uuid (),
    name text null,
    created_at timestamp with time zone not null default now(),
    type uuid null,
    additional jsonb null default '{}'::jsonb,
    term text null,
    year text null,
    constraint semesters_pkey primary key (id)
  ) tablespace pg_default;