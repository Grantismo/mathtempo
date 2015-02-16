def FirstFactorial(num)
  product = num 

  (1...num).each do |n|
    product = product * n
  end
  return product
end
