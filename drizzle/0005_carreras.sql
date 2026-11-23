INSERT INTO "catalogo_valor" ("catalogo", "codigo", "etiqueta", "orden") VALUES
  ('carrera', 'IC', 'Ingeniería Civil', 1),
  ('carrera', 'IA', 'Ingeniería en Alimentos', 2),
  ('carrera', 'ICO', 'Ingeniería en Computación', 3),
  ('carrera', 'ID', 'Ingeniería en Diseño', 4),
  ('carrera', 'IE', 'Ingeniería en Electrónica', 5),
  ('carrera', 'IFA', 'Ingeniería en Física Aplicada', 6),
  ('carrera', 'II', 'Ingeniería Industrial', 7),
  ('carrera', 'IMA', 'Ingeniería Mecánica Automotriz', 8),
  ('carrera', 'IM', 'Ingeniería en Mecatrónica', 9),
  ('carrera', 'IQPS', 'Ingeniería Química en Procesos Sostenibles', 10),
  ('carrera', 'LCE', 'Licenciatura en Ciencias Empresariales', 11),
  ('carrera', 'LMA', 'Licenciatura en Matemáticas Aplicadas', 12),
  ('carrera', 'LEM', 'Licenciatura en Estudios Mexicanos modalidad virtual', 13),
  ('carrera', 'POS', 'Posgrado', 14)
ON CONFLICT ("catalogo", "codigo") DO NOTHING;
