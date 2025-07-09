delete from Employees 
where DATEDIFF(year, BirthDate, GETDATE()) > 70