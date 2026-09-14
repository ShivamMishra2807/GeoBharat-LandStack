# GeoBharat Django Backend

## Local setup

```powershell
py -3.13 -m pip install -r backend/requirements.txt
py -3.13 backend/manage.py migrate
py -3.13 backend/manage.py seed_demo
py -3.13 backend/manage.py runserver
```

The API is available at `http://127.0.0.1:8000/api/v1/`.

Demo accounts:

- Citizen: `ramesh.patil@example.in` / `citizen123`
- Citizen: `sunita.gaikwad@example.in` / `citizen123`
- Official: `admin` / `admin123`

Set `VITE_USE_MOCK=false` and `VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1` in the frontend environment to use this backend.

The default database is SQLite for local development. Set `DATABASE_URL` to a PostgreSQL connection string for deployment. The current geometry is stored as GeoJSON JSON fields; migrating to PostGIS can replace the `Parcel.geometry` field with a spatial field when PostgreSQL is enabled.