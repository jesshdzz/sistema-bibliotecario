CREATE FUNCTION titulo_numero_ficha_inmutable() RETURNS trigger AS $$
BEGIN
  IF NEW.numero_ficha IS DISTINCT FROM OLD.numero_ficha THEN
    RAISE EXCEPTION 'titulo.numero_ficha es inmutable';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint
CREATE TRIGGER titulo_numero_ficha_inmutable
BEFORE UPDATE OF numero_ficha ON titulo
FOR EACH ROW EXECUTE FUNCTION titulo_numero_ficha_inmutable();
